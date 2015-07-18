var express     = require('express');
var app         = express();
var path        = require('path');
var logger      = require('morgan');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var config      = require('./config');

mongoose.connect(config.database);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// handles CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function( req, res ){
    res.send('Hello, World')
});

app.listen(config.port);
console.log('Animu started on port ' + config.port);

