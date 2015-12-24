'use strict';

/**
 * Module dependencies.
 */
var Show  = require('../models/show.server.model.js');
var Media = require('../models/media.server.model.js');
var chalk = require('chalk');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;

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

    //display
    if( req.body.path )             show.path            = req.body.path;
    if( req.body.alt_name )         show.alt_name        = req.body.alt_name;
    if( req.body.tags )             show.tags            = req.body.tags;

    //metadata
    if( req.body.mal_id )           show.mal_id          = req.body.mal_id;
    if( req.body.status )           show.status          = req.body.status;
    if( req.body.episode_count )    show.episode_count   = req.body.episode_count;
    if( req.body.episode_length )   show.episode_length  = req.body.episode_length;
    if( req.body.cover_image )      show.cover_image     = req.body.cover_image;
    if( req.body.synopsis )         show.synopsis        = req.body.synopsis;
    if( req.body.started_airing )   show.started_airing  = req.body.started_airing;
    if( req.body.finished_airing )  show.finished_airing = req.body.finished_airing;
    if( req.body.rating )           show.rating          = req.body.rating;
    if( req.body.age_rating )       show.age_rating      = req.body.age_rating;
    if( req.body.genres )           show.genres          = req.body.genres;


    show.save( function ( err, show ){
       // duplicate entry
       if ( err && err.code === 11000) {
           error = new Error('Show with that name already exists.');
           return complete( error, null );
       }
       complete( err, show );
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

    if (!req.params.show_name) {
        error = new Error('No paramater');
        return complete(error, null);
    }

    //you need valid id if you query and it needs to be in an id object
    var re = new RegExp('^[a-fA-F0-9]{24}$');
    var objId = new ObjectId( !re.test(req.params.show_name) ?
                '123456789012' : req.params.show_name );

    //I want the name and the id to work in the url, the id is needed if
    //the name is not url safe and needs to be modified manually.
    Show.findOne().or([{'name': req.params.show_name }, {'_id': objId }])
                  .populate('media').exec(function(err, show) {

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
            //you need valid id if you query and it needs to be in an id object
            var re = new RegExp('^[a-fA-F0-9]{24}$');
            var objId = new ObjectId( !re.test(req.params.show_name) ?
                        '123456789012' : req.params.show_name );

            //I want the name and the id to work in the url, the id is needed if
            //the name is not url safe and needs to be modified manually.
            Show.findOne().or([{'name': req.params.show_name }, {'_id': objId }])
                          .exec(function(err, show) {

                if (!show) {
                    error = new Error('No show with that name exists.');
                    return callback( error, null );
                }

                //display
                if( req.body.name )             show.name            = req.body.name;
                if( req.body.alt_name )         show.alt_name        = req.body.alt_name;
                if( req.body.path )             show.path            = req.body.path;
                if( req.body.tags )             show.tags            = req.body.tags;

                //metadata
                if( req.body.mal_id )           show.mal_id          = req.body.mal_id;
                if( req.body.status )           show.status          = req.body.status;
                if( req.body.episode_count )    show.episode_count   = req.body.episode_count;
                if( req.body.episode_length )   show.episode_length  = req.body.episode_length;
                if( req.body.cover_image )      show.cover_image     = req.body.cover_image;
                if( req.body.synopsis )         show.synopsis        = req.body.synopsis;
                if( req.body.started_airing )   show.started_airing  = req.body.started_airing;
                if( req.body.finished_airing )  show.finished_airing = req.body.finished_airing;
                if( req.body.rating )           show.rating          = req.body.rating;
                if( req.body.age_rating )       show.age_rating      = req.body.age_rating;
                if( req.body.genres )           show.genres          = req.body.genres;
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
                error = new Error('No paramater');
                return complete(error, null);
            }

            //you need valid id if you query and it needs to be in an id object
            var re = new RegExp('^[a-fA-F0-9]{24}$');
            var objId = new ObjectId( !re.test(req.params.show_name) ? "123456789012" : req.params.show_name );

            //I want the name and the id to work in the url, the id is needed if the name is not url safe and needs to be modified
            Show.findOne().or([{'name': req.params.show_name }, {'_id': objId }]).populate('media', 'name').exec(function(err, show) {
                if (!show) {
                    error = new Error('No show with that name exists.');
                    return complete( error, null );
                }
                callback(err, show);
            });
        },
        function ( show, callback) {
            for ( var i = 0; i < show.media.length; i++){
                console.log( show.media[i] )
                Media.remove({ '_id': show.media[i] });
            }
            Show.remove({ 'name': show.name }, function(err) {
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
    var tag = req.query.tag;
    var all;

    if(tag == "current_recent_updated"){
        all = Show.find({"tags": "current"}).sort({"updated_at":-1}).limit(5);
    } else if(tag == "archive_recent_added"){
        all = Show.find().select("name cover_image tags created_at path")
                         .select({"tags": "-current"})
                         .sort({"created_at":-1}).limit(5);
    } else if(tag){
        console.log(chalk.blue('Listing all ' + tag ));
        all = Show.find({"tags": tag});
    } else {
        console.log(chalk.blue('Listing all Shows.'));
        all = Show.find();
    }

    all.exec(function(err, shows) {
        if (err) console.log(chalk.red(err.message));

        // return the show
        else {
            console.log(shows);
            res.json(shows);
        }
    });
};

