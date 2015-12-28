'use strict';
const path        = require('path');
const bodyParser  = require('body-parser');

const mongoose    = require('mongoose');
const ObjectId    = require('mongoose').Types.ObjectId;
const Show        = require('./app/show/show.server.model.js');
const Media       = require('./app/media/media.server.model.js');

const config      = require('./config');
const favicon     = require('express-favicon');

const logger      = require('morgan');
const chalk       = require('chalk');

const express     = require('express');
const app         = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Lets the favicon work as well as other static assets. Nginx should
//be handling this by itself in production.
app.use(favicon(__dirname + '/public/assets/images/favicon.png'));
app.use(express.static(path.join(__dirname, 'public')));

// Handles CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// Connect to MongoDB
mongoose.connect(config.database, function(err){
    if(err){
        console.log(chalk.bold.red('Failed to connect to MongoDB.'));
        throw err;
    }
});


//Makes '/api' come before any other route uri, this also allows us use
//authentication for all of the routes that attach to this one.
var apiRouter = require('./libs/api.server.routes.js')(app, express);
app.use( '/api', apiRouter );

var userRouter  = require('./app/user/user.server.routes.js')(app, express);
var showRouter  = require('./app/show/show.server.routes.js')(app, express);
var mediaRouter = require('./app/media/media.server.routes.js')(app, express);

apiRouter.use( userRouter  );
apiRouter.use( showRouter  );
apiRouter.use( mediaRouter );

app.get('*', function(req, res) {
    res.sendFile(path.join( __dirname, 'public/app/index.html'));
});

app.listen(config.port);
console.log(chalk.bold.blue('Animu started on port ' + chalk.yellow(config.port)));

