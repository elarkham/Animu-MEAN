'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Show     = mongoose.model('Show');
var Media    = mongoose.model('Media');
var ObjectId = require('mongoose').Types.ObjectId;
var chalk    = require('chalk');
var async    = require('async');

/**
 * Create a Medium
 */
exports.create = function(req, res) {
    console.log(chalk.blue('Creating new media'));

    Show.findOne({'name':req.body.show.name}).exec( function( err, show ){
        console.log(req.body.show.name);
        //create now instance of media model
        var media = new Media();
        media.name = req.body.name;
        media.path = req.body.path;
        media.show = show._id;

        media.save( function(err){
            if(err) {
                // duplicate entry
                if (err.code === 11000) {
                    var error = 'Media with that name already exists.';
                    console.log(chalk.bold.red(error));
                    return res.json({ success: false, message: error });
                } else {
                    return res.send(err);
                }
            }

            // add media to the show
            show.addMediaID(media._id);
            show.save( function(err) {
                if (err) res.send(err);
                console.log(chalk.green('Media added to show: ' + chalk.yellow(show.name)));
            });

            // return a message
            var msg = 'Media: ' + media.name + ' created!';
            res.json({ success: true, message: msg });
            console.log(chalk.green(msg));
        })
    });

};

/**
 * Show the current Medium
 */
exports.read = function(req, res) {
    console.log(chalk.blue('Getting media with name: ' + req.params.media_name));
    Media.findOne({ 'name' : req.params.media_name }).populate('show').exec(function( err, media ){

        // if the show doesn't exist
        if (!media){
            var error = 'No media with that name exists.';
            res.json({success: false, message: error});
            console.log(chalk.bold.red('Error: ' + error));
            return;

        } if (err) res.send(err);

        // return a message
        res.json(media);
        console.log(chalk.green('Returning ' + req.params.media_name));

    });

};

/**
 * Update a Medium
 */
exports.update = function(req, res) {
    console.log(chalk.blue('Updating media: ' + req.params.media_name));
    async.waterfall([
        function( callback ){
            //find the media
            Media.findOne({ 'name': req.params.media_name }).populate('show').exec(function(err, media){
                if (!media) {
                    var error = 'No media with that name exists.';
                    return callback( new Error(error) );
                }

                if( req.body.name ) media.name = req.body.name;
                if( req.body.path ) media.path = req.body.path;
                if( req.body.seq ) media.seq = req.body.seq;
                if( !req.body.show ) return complete( err, media );

                callback(err, media);
            });
        },
        function( media, callback ){
            //find the media's current show
            Show.findOne({'name': media.show.name }).exec(function(err, show){
                if (!show) {
                    var error = 'Current show does not exists.';
                    console.log( chalk.red.bold( error ) );
                    return callback( null, media );
                }

                //remove the media from the show
                show.removeMediaID( media._id );
                show.save( function (err, show) {
                    if (err) return complete( err, media );
                });


                callback(err, media );
            });
        },
        function( media, callback ){
            //find the media's new show
            Show.findOne({'name': req.body.show.name }).exec(function(err, show){
                if (!show) {
                    var error = 'Newly entered show does not exist';
                    return complete( new Error(error), media );
                }

                //add media to show
                show.addMediaID( media._id );

                //add show to media
                media.show = show;

                show.save( function (err, show) {
                    if (err) return callback( err, media );
                });


                callback(err, media);
            });

        }
    ], complete);

    function complete( err, media ){
        if (err){
            var error = err.message;
            console.log( chalk.red.bold( error ) );
            return res.json({ success: false, message: error });
        }
        media.save( function ( err, media ){
            if (err){
                var error = err.message;
                console.log( chalk.red.bold( error ) );
                return res.json({ success: false, message: error });
            }
            var msg = 'Update Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg })
        });
    }

};

/**
 * Delete an Medium
 */
exports.delete = function(req, res) {
    console.log(chalk.blue('Deleting ' + req.params.media_name ));
    Media.findOne({ 'name': req.params.media_name}).populate('show').exec(function(err, media){

        if (!media) {
            var error = 'No media with that name exists.';
            console.log(chalk.bold.red(error));
            res.json({ success: false, message: error } );
            return;

        } else if(err) throw err;

        Show.findById(media.show._id).exec(function(err, show){

            if (!show) {
                var error = 'No show with that name exists.';
                console.log(chalk.bold.red(error));
                res.json({ success: false, message: error } );
                return;

            } else if(err) throw err;

            show.removeMediaID( media._id );

            Media.remove({ 'name': req.params.media_name}, function(err) {
                if (err) res.send(err);

                // Mongodb can delete things that don't exist, can only confirm an error didn't occur.
                var msg = 'Deletion of ' + req.params.media_name + ' occured without error.';
                console.log(chalk.green(msg));
                res.json({ success: true, message: msg });
            });
        });
    });
};

/**
 * List of Media
 */
exports.list = function(req, res) {
    console.log(chalk.blue('Listing all Media.'));
    Media.find().populate('show', 'name').exec(function(err, media) {
        if (err) res.send(err);

        // return the show
        res.json(media);
    });
};
