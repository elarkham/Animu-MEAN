'use strict';
var api   = require('../controllers/api.server.controller.js');
var User  = require('../models/user.server.model.js');
var chalk = require('chalk');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    //Give token in response to valid user login
    apiRouter.post('/authenticate', api.giveToken );

    //Verify attached token
    apiRouter.use( api.verifyToken );

    apiRouter.get('/me', function(req, res){
        User.findById( req.decoded._id, function(err, user ){

            //Check if user actually exists
            if (!user){
                var error = 'User with that id does not exist.';
                res.json({succes: false, message: error});
                console.log(chalk.bold.red('Error: ' + error));
            }

            else if (err) res.send(err);

            // return that user
            else {
                console.log(chalk.green('Returning user: \'' + user.username + '\''));
                res.json(user);
            }

        });
    });

    return apiRouter;
};
