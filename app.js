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

app.listen(3000, function() {
    console.log('Listening on port 3000');
});