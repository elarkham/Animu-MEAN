'use strict';

/**
 * Module dependencies.
 */
var Show  = require('../models/show.server.model.js');
var Media = require('../models/media.server.model.js');
var chalk = require('chalk');
var async = require('async');

/**
 * Create a Show
 */
exports.create = function(req, res) {
    console.log(chalk.blue('Creating new show'));
    var error;
    var msg;

    //create new show
    var show = new Show();

    //make sure name was included
    if( !req.body.name ){
        error = new Error('You must include a name');
        console.log(chalk.red.bold(error));
        return complete( error, null );
    } else {
        show.name = req.body.name;
    }

    //path is optional on creation
    if( req.body.path ) show.path = req.body.path;

    show.save( function ( err, show ){
        // duplicate entry
        if ( err && err.code === 11000) {
            error = new Error('Show with that name already exists.');
            return complete( error, null );
        }
        return complete( err, show );
    });

    function complete( err, show ){
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Creation Successfull!';
        console.log( chalk.green( msg ) );
        return res.json({ success: true, message: msg });
    }


};

/**
 * Show the current Show
 */
exports.read = function(req, res) {
    console.log(chalk.blue('Getting Show'));
    var error;

    if (!req.params.show_name){
        error = new Error('No paramater');
        return complete(error, null);
    }

    Show.findOne({ 'name' : req.params.show_name }).populate('media').exec(function(err, show) {
        // if the show doesn't exist
        if (!show){
            error = new Error('No show with that name exists.');
            return complete(error, null);

        }
        complete( err, show );
    });

    function complete( err, show ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Creation Successfull!';
        console.log( chalk.green( msg ) );
        return res.json( show );
    }

};

/**
 * Update a Show
 */
exports.update = function(req, res) {
    console.log(chalk.blue('Updating show'));
    var error;

    async.waterfall([
        function( callback ){
            if (!req.params.show_name){
                error = new Error('No paramater');
                return complete(error, null);
            }
            //find the show
            Show.findOne({ 'name': req.params.show_name }).exec(function(err, show){
                if (!show) {
                    error = new Error('No show with that name exists.');
                    return callback( error, null );
                }

                //optionally change values
                if (req.body.name) show.name = req.body.name;
                if (req.body.path) show.path = req.body.path;

                callback(err, show);
            });
        },
        function ( show, callback ) {
            show.save( function ( err, show ){
                // duplicate entry
                if ( err && err.code === 11000) {
                    error = new Error('Show with that name already exists.');
                    return callback( error, null );
                }
                callback(err, show);
            });
        }
    ], complete);

    function complete( err, show ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Update Successfull!';
        console.log( chalk.green( msg ) );
        return res.json({ success: true, message: msg });
    }


};

/**
 * Delete an Show
 */
exports.delete = function(req, res) {
    console.log(chalk.blue('Deleting ' + req.params.show_name ));
    var error;
    async.waterfall([
        function( callback ){
            if (!req.params.show_name){
                error = new Error('Now paramater');
                return complete(error, null);
            }
            Show.findOne({ 'name': req.params.show_name}).exec(function(err, show){
                if (!show) {
                    error = new Error('No show with that name exists.');
                    return complete( error, null );
                }
                callback(err, show);
            });
        },
        function ( show, callback) {
            Show.remove({ 'name': show.name}, function(err) {
                callback( err, show );
            });
    }], complete);

    function complete( err, show ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Deletion of ' + show.name + ' occured without error.';
        console.log(chalk.green(msg));
        res.json({ success: true, message: msg });
    }

};

/**
 * List of Shows
 */
exports.list = function(req, res) {
    console.log(chalk.blue('Listing all Shows.'));
    Show.find().exec(function(err, shows) {
        if (err) res.send(err);

        // return the show
        res.json(shows);
    });
};

