'use strict';
var api   = require('../controllers/api.server.controller.js');
var User  = require('../models/user.server.model.js');
var Show  = require('../models/show.server.model.js');
var Media = require('../models/media.server.model.js');
var chalk = require('chalk');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    //Give token in response to valid user login
    apiRouter.post('/authenticate', api.giveToken );

    //Verify attached token
    apiRouter.use( api.verifyToken );

    apiRouter.get('/me', function(req, res){
        var recent = req.query.tag;
        User.findById( req.decoded._id )
            .populate('shows_watched.data media_watched.data')
            .exec( function( err, user ){

            //Check if user actually exists
            if (!user){
                var error = 'User with that id does not exist.';
                res.json({succes: false, message: error});
                console.log(chalk.bold.red('Error: ' + err));
            }

            else if (err) res.send(err);

            // return that user
            else {
                console.log(chalk.green('Returning user: \'' + user.username + '\''));
                if(recent){
                    console.log(chalk.green('Sending ' + recent + ' most recent watches'));
                    user.media_watched = {};
                    user.shows_watched.sort(function(a,b){
                        if (a.date < b.date)
                            return 1;
                        if (a.date > b.date)
                            return -1;
                        return 0;
                    });
                    user.shows_watched.splice( recent, user.shows_watched.length);
                }
                res.json(user);
            }

        });
    });

    return apiRouter;
};
