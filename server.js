'use strict';
var express     = require('express');
var app         = express();
var path        = require('path');
var logger      = require('morgan');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var chalk       = require('chalk');
var config      = require('./config');

mongoose.connect(config.database, function(err){
    if(err){
        console.log(chalk.bold.red('Failed to connect to MongoDB.'));
        throw err;
    }
});

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


var apiRouter = require('./app/routes/api.server.routes.js')(app, express);
app.use( '/api', apiRouter );

app.get('*', function(req, res) {
        res.sendFile(path.join( __dirname, 'public/app/views/index.html'));
});


app.listen(config.port);
console.log(chalk.bold.blue('Animu started on port ' + chalk.yellow(config.port)));

