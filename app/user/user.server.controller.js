'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User  = require('./user.server.model.js');
var chalk = require('chalk');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;

/**
 * Create User
 */
exports.create = function(req, res) {
    console.log(chalk.blue('Creation of new user requested'));
    var user = new User();
    var error;

    //make sure username was included
    if( !req.body.username ){
        error = new Error('Username Required');
        console.log(chalk.red.bold(error));
        return complete( error, null );
    } else {
        user.username = req.body.username;
    }

    //make sure passowrd was included
    if( !req.body.password ){
        error = new Error('Password Required');
        console.log(chalk.red.bold(error));
        return complete( error, null );
    } else {
        user.password = req.body.password;
    }

    if ( req.body.name ) user.name = req.body.name;

    // only an admin can modify this attribute
    if (req.body.admin && ( req.decoded.admin === true ) ) {
            user.admin = req.body.admin;
    }

    user.save(function(err, user) {
        if (err && err.code === 11000) {
            error = new Error('Username already exists');
            console.log(chalk.red.bold(error));
            return complete(error, user );
        }
        complete( err, user );
    });

    function complete( err, user ){
        var msg;
        if (err){
            msg = 'Failed to save new user';
            console.log( err.err );
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Creation of ' + user.name + ' Successfull!';
        console.log( chalk.green( msg ) );
        return res.json({ success: true, message: msg });
    }
};

/**
 * Show User
 */
exports.read = function(req, res) {
    console.log(chalk.blue('User Requested'));
    var error;
    var id;

    // This is shared by the '/user/:user_id' route and the
    // '/me' route. If there is no :user_id we assume its
    // being used by '/me'.
    if (!req.params.user_id) {
        if( req.decoded._id ) id = req.decoded._id;
        else {
            error = new Error('No paramater');
            return complete(error, null);
        }
    }
    else id = req.params.user_id;

    console.log(chalk.yellow('Searching for user with id ' + id));
    User.findById(id)
        .populate('show_history.show media_history.media queue.show')
        .exec(function(err, user) {

        if (!user){
            error = new Error('User with that id does not exist.');
            return complete( error, null );
        }

        complete( err, user );
    });

    function complete( err, user ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Search was Successfull!';
        console.log( chalk.green( msg ) );
        return res.json( user );
    }

};

/**
 * Update User
 */
exports.update = function(req, res) {
    console.log(chalk.blue('Update for User Requested'));
    var error;
    var id;

    // This is shared by the '/user/:user_id' route and the
    // '/me' route. If there is no :user_id we assume that
    // its being used by '/me'.
    if (!req.params.user_id) {
        if( req.decoded._id ) id = req.decoded._id;
        else {
            error = new Error('No paramater');
            return complete(error, null);
        }
    }
    else id = req.params.user_id;

    console.log(chalk.yellow('Searching for user with id ' + id));
    User.findById(id, function(err, user) {

        if (!user) {
            var error = new Error('User with that id does not exist.');
            return complete( error, null );
        }

        // login information
        if ( req.body.name     ) user.name     = req.body.name;
        if ( req.body.username ) user.username = req.body.username;
        if ( req.body.password ) user.password = req.body.password;

        // update what shows user has watched
        if ( req.body.show_history  ) user.show_history  = req.body.show_history.slice();
        if ( req.body.media_history ) user.media_history = req.body.media_history.slice();

        // only an admin can modify this attribute
        if (req.body.admin && ( req.decoded.admin === true ) ) {
                user.admin = req.body.admin;
        }

        complete( err, user );

    });

    function complete( err, user ){
        var msg;

        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }

        console.log(chalk.yellow('Saving...') );
        user.save( function(err) {
            if ( err && err.code === 11000 ) {
                msg ='Username already exists.';
                return complete( error, null );
            }else if (err){
                msg = 'Failed to save new User';
                console.log(err.err);
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }
            console.log(user);
            msg = 'Update of ' + user.name + ' Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg });
        });

    }
};

/**
 * Delete User
 */
exports.delete = function(req, res) {
    console.log(chalk.blue('Deletion of User Requested'));
    var error;

    if (!req.params.user_id){
        error = new Error('No paramater');
        return complete(error, null);
    }

    console.log(chalk.yellow('Searching for user with id ' + req.params.user_id ) );
    User.findOne({'_id': req.params.user_id}).exec(function(err, user){
        if (!user) {
            error = 'No user with that name exists.';
            return complete(new Error(error), null );
        }
        console.log(chalk.blue('Found: ' + chalk.yellow(user.username) ) );
        user.remove(complete);
    });
    function complete( err, user ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Deletion of ' + req.params.user_id + ' occured without error.';
        console.log(chalk.green(msg));
        res.json({ success: true, message: msg });
    }
};

/**
 * Reset User
 */
exports.reset = function(req, res) {
    console.log(chalk.blue('User reset requested'));
    var error;
    var id;

    // Only /me can access this at the moment. Leaving this
    // statment for when I figure out how I want /users to
    // get to this function in the future.
    if (!req.params.user_id) {
        if( req.decoded._id ) id = req.decoded._id;
        else {
            error = new Error('No paramater');
            return complete(error, null);
        }
    }
    else id = req.params.user_id;

    console.log(chalk.yellow('Searching for user with id ' + id));
    User.findById(id, function(err, user) {

        if (!user) {
            var error = new Error('User with that id does not exist.');
            return complete( error, null );
        }

        user.name          = '';
        user.queue         = [];
        user.show_history  = [];
        user.media_history = [];

        user.save( function(user, err){
            complete( user, err );
        });

    });

    function complete( err, user ){
        var msg;

        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }

        console.log(chalk.yellow('Saving...') );
        user.save( function(err) {
            if (err){
                msg = 'Failed to save User';
                console.log(err.err);
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }
            console.log(user);
            msg = 'Reset of ' + user.name + ' was Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg });
        });

    }
};

/**
 * List of Users
 */
exports.list = function(req, res) {
    console.log(chalk.blue('Listing all users.'));

    User.find().exec(function(err, users) {
        if (err) res.send(err);
        res.json(users);
    });
};

/**
 * Push to User
 */
exports.push = function(req, res) {
    console.log(chalk.blue('Data has been pushed to a User'));
    var error;
    var id;

    // This is shared by the '/user/:user_id' route and the
    // '/me' route. If there is no :user_id we assume that
    // its being used by '/me'.
    if (!req.params.user_id) {
        if( req.decoded._id ) id = req.decoded._id;
        else {
            error = new Error('No paramater');
            return complete(error, null);
        }
    }
    else id = req.params.user_id;

    console.log(chalk.yellow('Searching for user with id ' + id));
    User.findById(id).exec( function(err, user) {

        if (!user) {
            var error = new Error('User with that id does not exist.');
            return complete( error, null );
        }

        /*** Capusle Object
         *  ------------------------------------------------------------------------------
         *  'show_history'  : [{ show, date, seq  }]  -Tracks what show a user watched
         *  'media_history' : [{ show, date, prog }]  -Tracks what media a user watched
         *  'queue'         : [{ show, prio }]        -Shows the user plans to watch
         *  ------------------------------------------------------------------------------
         ***/

        if ( req.body.show_history  ) user.push_shows(req.body.show_history,  error_check);
        if ( req.body.media_history ) user.push_media(req.body.media_history, error_check);
        if ( req.body.queue         ) user.push_queue(req.body.query, error_check);

        complete( err, user );
    });

    function error_check( err ){
        if( err ){
            complete(err, null);
        }
    }

    function complete( err, user ){
        var msg;

        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }

        console.log(chalk.yellow('Saving...') );
        user.save( function(err) {
            if (err){
                msg = 'Failed to save new User';
                console.log(err.err);
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }
            console.log(user);
            msg = 'Push to ' + user.username + ' was Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg });
        });

    }
};

