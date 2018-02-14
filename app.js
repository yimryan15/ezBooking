const express = require('express');
const logger = require('morgan');
const request = require('request-promise');
const exphbs  = require('express-handlebars');
const favicon = require('serve-favicon');
const path = require('path');
const { apiKey } = require('./api_key');
const app = express();

app.use(logger('dev'));
app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/getFlightInfo/:origin/:destination/:depDate/:returnDate/:maxPrice?', function(req, res) {
  const origin = req.params.origin
  const destination = req.params.destination
  const depDate = req.params.depDate
  const returnDate = req.params.returnDate
  const maxPrice = req.params.maxPrice

  flightAffiliateSearch(origin, destination, depDate, returnDate, maxPrice).then(function(data) {
    if (data.results.length === 0) {
      res.render('error')
    } else {
      return data;
    }
  })
  .then(function(data) {
    const flightData = data.results.map(function(data) {
      const outboundFlights = [];
      const inboundFlights = [];
      const obDuration = data.outbound.duration;
      const ibDuration = data.inbound.duration;
      const deep_link = data.deep_link;
      const price = data.fare.total_price;

      data.outbound.flights.forEach(function (flight) {
        outboundFlights.push(getFlightData(flight));
      })

      data.inbound.flights.forEach(function (flight) {
        inboundFlights.push(getFlightData(flight));
      })

      return {
        outboundFlights,
        inboundFlights,
        obDuration,
        ibDuration,
        deep_link,
        price
      }
    })

    const inputData = {
      origin,
      destination,
      depDate,
      returnDate,
      maxPrice
    }

    const renderData = {
      flightData,
      inputData
    }

    res.render('home', renderData);
  })

});

function getFlightData(data) {
  const {
    departs_at: departTime,
    arrives_at: arriveTime,
    origin: {
      airport: originCity
    },
    destination: {
      airport: destCity
    }
  } = data;

  return {
    departTime,
    arriveTime,
    originCity,
    destCity
  }
}

function flightAffiliateSearch(ori, dest, dep_date, ret_date, price) {
  let options = {
    url: 'https://api.sandbox.amadeus.com/v1.2/flights/affiliate-search',
    qs: {
      apikey: apiKey,
      origin: ori,
      destination: dest,
      departure_date: dep_date,
      return_date: ret_date,
      max_price: price,
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
