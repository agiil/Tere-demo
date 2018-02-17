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
  var cert = utils.pemToCert(sp_options.cert);
  // Loe metateabemall
  var metateave = utils.removeWhitespace(fs.readFileSync('lib/metateabemall.xml').toString());

  var sig = new SignedXml();
  
  // Määra allkirjastatava puu juur, teisendused ja räsialgoritm
  sig.addReference("//*[local-name(.)='EntityDescriptor']",
    ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/2001/10/xml-exc-c14n#"],
    sp_options.digestAlgorithm);

  sig.signingKey = sp_options.private_key;

  // Määra serdi lisamine
  /* sig.keyInfoProvider = {
    getKeyInfo: function (key, prefix) {
      prefix = prefix ? prefix + ':' : prefix;
      return "<" + prefix + "X509Data><" + prefix + "X509Certificate>" + cert + "</" + prefix + "X509Certificate></" + prefix + "X509Data>";
    }
  }; */

  var doc;
  try {
    doc = new Parser().parseFromString(metateave);
  } catch (err) {
    return utils.reportError(err, callback);
  }

  doc.documentElement.setAttribute('entityID', sp_options.entity_id);

  // Määra kehtivuse lõpp (+24 h)
  var now = moment.utc();
  now.add(1, 'day');
  doc.documentElement.setAttribute('validUntil', now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));

  // Määra autentimisvastuse vastuvõtu-URL
  doc.documentElement.getElementsByTagName('md:AssertionConsumerService')[0].setAttribute('Location', sp_options.assert_endpoint);

  var token = utils.removeWhitespace(doc.toString());
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
