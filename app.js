const express = require('express');
const logger = require('morgan');
const request = require('request-promise');
const exphbs  = require('express-handlebars');
const favicon = require('serve-favicon');
const path = require('path');
const { apiKey }= require('./api_key');
const app = express();

app.use(logger('dev'));
app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// app.get('/', function(req, res) {
//   flightAffiliateSearch().then(function(data) {
//     res.send(data);
//   })
// });

app.get('/', function(req, res) {
  res.render('home');
});

function flightAffiliateSearch() {
  let options = {
    url: 'https://api.sandbox.amadeus.com/v1.2/flights/affiliate-search',
    qs: {
      apikey: apiKey,
      origin: 'NYC',
      destination: 'ICN',
      departure_date: '2018-06-24',
      return_date: '2018-06-28',
      currency: 'USD'
    },
    json: true
  }

  return request(options).then(function(data) {
    return data;
  })
}

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
