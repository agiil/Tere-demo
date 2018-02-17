'use strict';

const express = require('express');
const fs = require('fs');
const metateave = require('./lib/metateave');

const sp_options = {
  entity_id: "https://tere-demo.herokuapp.com/metadata",
  private_key: fs.readFileSync("./votmed/key-file.pem").toString(),
  cert: fs.readFileSync("./votmed/cert-file.crt").toString(),
  assert_endpoint: "https://tere-demo.herokuapp.com/assert",
  signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
  digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256'
}; 

// Moodusta metateave
var metateaveXML = metateave.moodusta(sp_options);

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
  // TODO: Kontrolli metateabe kehtivust,
  // vajadusel uuenda
  res.header('Content-Type', 'text/xml').send(metateaveXML);
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
