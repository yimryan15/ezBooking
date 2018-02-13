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
    if (data.errors) {
      res.send(data.errors)
    } else {
      return data;
    }
  })
  .then(function(data) {
    // const normalizedFlightData = data.results.map(function(data) {
    //   return normalizeFlightData(data);
    // })
    const outboundFlights = [];
    const inboundFlights = [];

    data.results.forEach(function(obj) {
      obj.outbound.flights.forEach(function (flight) {
        outboundFlights.push(getOBData(flight));
      })
    })

    data.results.forEach(function(obj) {
      obj.inbound.flights.forEach(function (flight) {
        inboundFlights.push(getOBData(flight));
      })
    })

    const renderData = {

      outboundFlights,
      inboundFlights
    }

    res.render('home', renderData);
  })

});

function getOBData(data) {
  const {
    departs_at: obDepartTime,
    arrives_at: obArriveTime,
    origin: {
      airport: obCity
    },
    destination: {
      airport: obDestCity
    }
  } = data;

  return {
    obCity,
    obDestCity,
    obDepartTime,
    obArriveTime
  }
}

// function normalizeFlightData(data) {
//   const {
//     outbound: {
//       duration: obDuration,
//       flights: [{
//         departs_at: obDepartTime,
//         arrives_at: obArriveTime,
//         origin: {
//           airport: obCity
//         },
//         destination: {
//           airport: obDestCity
//         }
//       }],
//     },
//     inbound: {
//       duration: ibDuration,
//       flights: [
//       {
//         departs_at: ibDepartTime,
//         arrives_at: ibArriveTime,
//         origin: {
//           airport: ibCity
//         },
//         destination: {
//           airport: ibDestCity
//         }
//       }],
//     },
//     deep_link: deepLink,
//     fare: {
//       total_price: price
//     }
//   } = data;
//
//   return {
//     obDuration,
//     obDepartTime,
//     obArriveTime,
//     obCity,
//     obDestCity,
//     ibDuration,
//     ibDepartTime,
//     ibArriveTime,
//     ibCity,
//     ibDestCity,
//     deepLink,
//     price
//   }
// }

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
