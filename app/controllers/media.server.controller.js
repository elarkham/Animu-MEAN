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

    //display
    if( req.body.tags )     media.tags     = req.body.tags;

    //metadata
    if( req.body.filetype ) media.filetype = req.body.filetype;
    if( req.body.size )     media.size     = req.body.size;
    if( req.body.length )   media.length   = req.body.length;
    if( req.body.seq )      media.seq      = req.body.seq;
    if( req.body.lang )     media.lang     = req.body.lang;
    if( req.body.subgroup ) media.subgroup = req.body.subgroup;

    //location
    if( req.body.path ) media.path = req.body.path;
    if( req.body.show ) addShow(media);
    else complete( null, media );

    function addShow( media ) {
        //find the media's new show
        Show.findOne({'name': req.body.show }).exec(function(err, show){
            if (!show) {
                var error = 'Show does not exist';
                return complete( new Error( error ), null );
            }
            //add media to show
            show.addMediaID( media._id );

            //add show to media
            media.show = show;

            show.save( function (err, show) {
                return complete( err, media );
            });

        });
    }
    function complete( err, media ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        console.log(chalk.blue('Saving...') );
        media.save( function ( err, media ){
            // duplicate entry
            if (err && err.code === 11000) {
                msg = 'Media with that name already exists.';
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }
            console.log( media )
            msg = 'Creation Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg });
        });
    }

};

/**
 * Show the current Medium
 */
exports.read = function(req, res) {
    console.log(chalk.blue('Getting Media'));
    var error;

    if (!req.params.media_name){
        error = new Error('No paramater');
        return complete(error, null);
    }

    Media.findOne({ 'name' : req.params.media_name }).populate('show').exec(function(err, media) {
        // if the media doesn't exist
        if (!media){
            error = new Error('No media with that name exists.');
            return complete(error, null);
        }
        return complete( err, media );
    });

    function complete( err, media ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Sent ' + media.name;
        console.log( chalk.green( msg ) );
        return res.json( media );
    }
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
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        media.save( function ( err, media ){
            // duplicate entry
            if (err && err.code === 11000) {
                msg = 'Media with that name already exists.';
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }
            msg = 'Update Successfull!';
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
                callback(err, media);
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
                    return complete( new Error(error), null);
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
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Deletion of ' + media.name + ' occured without error.';
        console.log(chalk.green(msg));
        res.json({ success: true, message: msg });
    }
};

/**
 * List of Media
 */
exports.list = function(req, res) {
    var tag = req.query.tag;
    var all;

    if(tag){
        console.log(chalk.blue('Listing all ' + tag ));
        all = Media.find({"tags": tag});
    } else {
        console.log(chalk.blue('Listing all Media.'));
        all = Media.find();
    }

    all.populate('show', 'name').exec(function(err, shows) {
        if (err) console.log(chalk.red(err.message));

        // return the media
        else res.json(shows);
    });
};
