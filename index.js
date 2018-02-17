'use strict';

const express = require('express');
const saml2 = require('saml2-js');

// SP seadistused
var sp_options = {
  entity_id: "https://tere-demo.herokuapp.com/metadata",
  private_key: fs.readFileSync("votmed/key-file.pem").toString(),
  certificate: fs.readFileSync("votmed/cert-file.crt").toString(),
  assert_endpoint: "https://tere-demo.herokuapp.com/assert",
  force_authn: true,
  auth_context: { comparison: "exact", class_refs: ["urn:oasis:names:tc:SAML:1.0:am:password"] },
  nameid_format: "urn:oasis:names:tc:SAML:2.0:nameid-format:unspecified",
  sign_get_request: true,
  allow_unencrypted_assertion: true
}

// Moodusta SP 
var sp = new saml2.ServiceProvider(sp_options);

// Veebiserveri ettevalmistamine
const app = express();
app.set('port', (process.env.PORT || 5000));
// Sea staatiliste ressursside juurkaust
app.use(express.static(__dirname + '/public'));
// Sea vaadete kaust ja vaatetöötleja
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Esilehe kuvamine
app.get('/', function (req, res) {
  res.render('pages/index');
});

// Metateabe otspunkt
app.get('/metadata', (req, res) => {
  // Moodusta metateabe XML
  var metadata = sp.create_metadata();
  res.header('Content-Type', 'text/xml').send(metadata);
});

// Autentimispäringu saatmine
app.get('/auth', function (req, res) {
  // Autentimispäringute vastuvõtu otspunkt
  var suunaURL = 'https://eidastest.eesti.ee/EidasNode/ServiceProvider';
  res.redirect(suunaURL);
});

// Autentimisvastuse vastuvõtt
app.post('/assert', function (req, res) {
  res.send('Siin võetakse vastu autentimisvastus');
});

// Veebiserveri käivitamine
app.listen(app.get('port'), function () {
  console.log('---- Node rakendus käivitatud ----');
});
