'use strict';

const express = require('express');
const fs = require('fs');
const metateave = require('./lib/metateave');
const utils = require('./lib/utils');

const sp_options = {
  entity_id: "https://tere-demo.herokuapp.com/metadata",
  // private_key: JSON.parse(process.env.PRIVATE),
  // private_key: process.env.PRIVATE,
  signing_cert: fs.readFileSync("./serdid/sign.crt").toString(),
  encryption_cert: fs.readFileSync("./serdid/encrypt.crt").toString(),
  assert_endpoint: "https://tere-demo.herokuapp.com/assert",
  // xml-crypto toetatud algod vt: 
  // https://www.npmjs.com/package/xml-crypto
  signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
  digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256'
}; 

/* Võta privaatvõtmed, kas Heroku keskkonnamuutujatest või lokaalsest .env failist. Lokaalse faili korral tuleb lisada jutumärgid ja asendada reavahetused \n-ga. Võtme lisamine Heroku keskkonnamuutujasse:
  heroku config:set PRIVATE="$(cat salajane/key_file.json)"
Failis key_file.json on PEM-võti, milles reavahetused on asendatud
\n ja lisatud jutumärgid.  
 Vt http://www.beardedhacker.com/blog/2014/10/20/load-private-key-to-heroku/
*/ 
var allkirjavoti = process.env.SIGNKEY;
var krypteerimisvoti = process.env.DECRYPTKEY;
/* Lokaalsel käivitamisel (heroku local) toob Heroku keskkonnamuutujad
 pilvest muutujasse .env. Jutumärgid lähevad toomisel kaotsi. 
*/
// Taastame PEM-vormingu reavahetused
sp_options.signing_key = utils.taastaPEM(allkirjavoti);
sp_options.encryption_key = utils.taastaPEM(krypteerimisvoti);

// Kontrolliks privaatvõtme kuvamine konsoolil
// console.log('Võti:');
// console.log(sp_options.private_key);

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
