'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var chalk = require('chalk');


/**
 * Create a User
 */
exports.create = function(req, res) {
    console.log(chalk.blue('Creating new user'));

    var error;

    // if a username isn't included
    if (!req.body.username) {
        error = 'You must include a username.';
        res.json({success: 'false', message: error});
        console.log(chalk.bold.red('Error: ' + error));
        return;
    }
    // if a password isn't included
    if (!req.body.password) {
        error = 'You must include a password';
        res.json({success: false, message: error});
        console.log(chalk.bold.red('Error: ' + error));
        return;
    }

    var user = new User();      // create a new instance of the User model
    user.name = req.body.name;  // set the users name (comes from the request)
    user.username = req.body.username;  // set the users username (comes from the request)
    user.password = req.body.password;  // set the users password (comes from the request)

    user.save(function(err, user) {
        if (err) {
            // duplicate entry
            if (err.code === 11000) {
                console.log(chalk.bold.red('Error: That username alread exists'));
                return res.json({ success: false, message: 'A user with that username already exists. '}); }
            else
                return res.send(err);
        }

        // return a message
        res.json({ success: true, message: 'User created!' });
        console.log(chalk.green('Created User: '+ user.name));
    });
};

/**
 * Show the current User
 */
exports.read = function(req, res) {
    console.log(chalk.blue('Getting user with id:' + req.params.user_id));
    User.findById(req.params.user_id, function(err, user) {

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
};

/**
 * Update a User
 */
exports.update = function(req, res) {

    console.log(chalk.blue('Updating user with id:' + req.params.user_id));

    User.findById(req.params.user_id, function(err, user) {
        // if user does not exist
        if (!user) {
            var error = 'User with that id does not exist.';
            res.json({ success: false, message: error});
            console.log(chalk.bold.red('Error: ' + error));
            return;
        }
        // for when something I didnt forsee happens.
        if (err)  {
            res.send(err);
            return;
        }

        // set the new user information if it exists in the request
        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;
        if (req.body.admin){
            if (req.decoded.admin == true ) {
                user.admin = req.body.admin;
            }
        }

        // save the user
        user.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }

            // return a message
            res.json({ success: true, message: 'User updated!' });
            console.log(chalk.green('User: '+ user.name + ' Updated!'));
        });
    });
};

/**
 * Delete an User
 */
exports.delete = function(req, res) {
    console.log(chalk.blue('Deleting user with id:' + req.params.user_id));
    User.remove({ _id: req.params.user_id}, function(err) {

        // something I didnt forsee happened
        if (err) res.send(err);

        // inform deletion was success
        else {
            var success = 'User successfully deleted';
            res.json({ success: true, message: success });
            console.log(chalk.green(success));
        }
    });
};

/**
 * List of Users
 */
exports.list = function(req, res) {
    console.log(chalk.blue('Listing all users.'));
    User.find(function(err, users) {
        if (err) res.send(err);

        // return the users
        res.json(users);
    });
};
