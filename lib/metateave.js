/**
 * Metateabe otspunkti moodustamine
 */
var
  utils = require('./utils'),
  Parser = require('xmldom').DOMParser,
  SignedXml = require('xml-crypto').SignedXml,
  moment = require('moment'),
  fs = require('fs');

exports.moodusta = function (sp_options) {

  // Loe metateabemall
  var metateave = utils.removeWhitespace(fs.readFileSync('lib/metateabemall.xml').toString());

  // Parsi XML DOM-kujule
  var doc;
  try {
    doc = new Parser().parseFromString(metateave);
  } catch (err) {
    return utils.reportError(err, callback);
  }

  /* Täienda dokumenti
   DOM Level 2 liidesed vt:
     https://docs.python.org/2/library/xml.dom.html# (hea)
     https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
  */
  doc.documentElement.setAttribute('entityID', sp_options.entity_id);

  // Lisa kehtivuse lõpp (+24 h)
  var now = moment.utc();
  now.add(1, 'day');
  doc.documentElement.setAttribute('validUntil', now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));

  // Lisa autentimisvastuse vastuvõtu-URL
  doc.documentElement.getElementsByTagName('md:AssertionConsumerService')[0].setAttribute('Location', sp_options.assert_endpoint);

  // Lisa serdid (md:KeyDescriptor use="signing" ja use="encryption")
  // Allkirjastamissert
  var allkirjasert = doc.createTextNode(utils.pemToCert(sp_options.signing_cert));
  doc.documentElement.getElementsByTagName('ds:X509Certificate')[0].appendChild(allkirjasert);
  // Krüpteerimissert
  var krypteerimissert = doc.createTextNode(utils.pemToCert(sp_options.encryption_cert));
  doc.documentElement.getElementsByTagName('ds:X509Certificate')[1].appendChild(krypteerimissert);

  // Veelkordne tühikute eemdaldamine, igaks juhuks
  var token = utils.removeWhitespace(doc.toString());

  // Alusta allkirjastamist
  // Vt https://www.npmjs.com/package/xml-crypto
  var sig = new SignedXml();
  // Määra allkirjastamisalgoritm. (Vaikimisi RSA-SHA1)
  sig.signatureAlgorithm =
    sp_options.signatureAlgorithm;
  
  // Määra
  sig.addReference(
    // allkirjastatava puu juur
    "//*[local-name(.)='EntityDescriptor']",
    // teisendused 
    ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/2001/10/xml-exc-c14n#"],
    // ja räsialgoritm
    sp_options.digestAlgorithm);

  sig.signingKey = sp_options.signing_key;

  // Vii sert sobivale kujul 
  var cert = utils.pemToCert(sp_options.signing_cert);

  // Määra serdi lisamine allkirja
  sig.keyInfoProvider = {
    getKeyInfo: function (key, prefix) {
      prefix = prefix ? prefix + ':' : prefix;
      return "<" + prefix + "X509Data><" + prefix + "X509Certificate>" + cert + "</" + prefix + "X509Certificate></" + prefix + "X509Data>";
    }
  };

  var signed;
  try {
    var opts = {
      location: {
        reference: "//md:Extensions",
        action: 'before'
      },
      prefix: 'ds'
    };

    sig.computeSignature(token, opts);
    signed = sig.getSignedXml();
  } catch (err) {
    return utils.reportError(err);
  }

  return signed;
}
