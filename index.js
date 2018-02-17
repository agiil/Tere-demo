'use strict';

const express = require('express');

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

// Autentimispäringu saatmine
app.get('/auth', function (req, res) {
  // Autentimispäringute vastuvõtu otspunkt
  var suunaURL = 'https://eidastest.eesti.ee/EidasNode/ServiceProvider';
  res.redirect(suunaURL);
});

// Veebiserveri käivitamine
app.listen(app.get('port'), function () {
  console.log('---- Node rakendus käivitatud ----');
});
