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

    //create new media
    var media = new Media();

    //make sure name was included
    if( !req.body.name ){
        var error = new Error('You must include a name');
        console.log(chalk.red.bold(error));
        return complete( error, null );
    } else {
        media.name = req.body.name;
    }

    //path is optional on creation
    if( req.body.path ) media.path = req.body.path;
    //seq is optional TODO: Make this only accept numbers
    if( req.body.seq ) media.seq = req.body.seq;
    //show is optional on creation TODO: Actually make it optional
    if( req.body.show ) addShow(media);
    else complete( null, media);


    function addShow( media ) {
        //find the media's new show
        Show.findOne({'name': req.body.show.name }).exec(function(err, show){
            if (!show) {
                var error = 'Show does not exist';
                return complete( new Error(error), null );
            }

            //add media to show
            show.addMediaID( media._id );

            //add show to media
            media.show = show;

            show.save( function (err, show) {
                if (err) return complete( err, media );
            });

            complete( err, media );
        });
    }

    function complete( err, media ){
        if (err){
            var error = err.message;
            console.log( chalk.red.bold( error ) );
            return res.json({ success: false, message: error });
        }
        media.save( function ( err, media ){
            if (err){
                var error;
                // duplicate entry
                if (err.code === 11000) {
                    error = 'Media with that name already exists.';
                } else {
                    error = err.message;
                }
                console.log( chalk.red.bold( error ) );
                return res.json({ success: false, message: error });
            }
            var msg = 'Creation Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg });
        });
    }

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
            if (!media.show) {
                var error = 'Media does not have a show yet.';
                console.log( chalk.red.bold( error ) );
                //Its ok if it does not have a show yet, so no err
                return callback( null, media );
            }
            //find the media's current show
            Show.findOne({'name': media.show.name }).exec(function(err, show){
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
            return res.json({ success: true, message: msg });
        });
    }

};

/**
 * Delete an Medium
 */
exports.delete = function(req, res) {
    console.log(chalk.blue('Deleting ' + req.params.media_name ));

    async.waterfall([
        function( callback ){
            var error;
            if (!req.params.media_name){
                error = 'Now paramater';
                return complete(new Error(error), null);
            }
            Media.findOne({ 'name': req.params.media_name}).populate('show').exec(function(err, media){
                if (!media) {
                    error = 'No media with that name exists.';
                    return complete(new Error(error), null );
                }
                callback(err, media)
            });
        },
        function (media, callback){
            if (!media.show) {
                var error = 'Media does not have a show.';
                console.log( chalk.red.bold( error ) );
                //Its ok if it does not have a show, so no err
                return callback( null, media );
            }
             Show.findById(media.show._id).exec(function(err, show){
                if (!show) {
                    var error = 'No show with that name exists.';
                    return compete( new Error(error), null);
                }
                show.removeMediaID( media._id );
                callback( err, media );
            });

        },
        function ( media, callback) {
            Media.remove({ 'name': media.name}, function(err) {
                callback( err, media );
            });
    }], complete);

    function complete( err, media){
        if (err){
            var error = err.message;
            console.log( chalk.red.bold( error ) );
            return res.json({ success: false, message: error });
        }
        var msg = 'Deletion of ' + media.name + ' occured without error.';
        console.log(chalk.green(msg));
        res.json({ success: true, message: msg });
    }
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
