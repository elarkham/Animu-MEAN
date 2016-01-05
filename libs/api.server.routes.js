'use strict';
var api   = require('./authenticate.server.js');
var User  = require('../app/user/user.server.model.js');
var Show  = require('../app/show/show.server.model.js');
var Media = require('../app/media/media.server.model.js');
var chalk = require('chalk');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    //Give token in response to valid user login
    apiRouter.post('/authenticate', api.giveToken );

    //Verify attached token
    apiRouter.use( api.verifyToken );

    return apiRouter;
};
