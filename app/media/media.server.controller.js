'use strict';
/**
 * Module Dependencies
 */
var Show     = require('../show/show.server.model.js');
var Media    = require('../media/media.server.model.js');
var ObjectId = require('mongoose').Types.ObjectId;
var chalk    = require('chalk');

/**
 * Create new Media
 */
exports.create = function(req, res) {
    console.log(chalk.blue('Creation of new Media requested'));
    var media = new Media();

    //make sure name was included
    if( !req.body.name ){
        var error = new Error('Name Required');
        return complete( error, null );
    } else {
        media.name = req.body.name;
    }

    //metadata
    if( req.body.filetype ) media.filetype = req.body.filetype;
    if( req.body.size     ) media.size     = req.body.size;
    if( req.body.length   ) media.length   = req.body.length;
    if( req.body.seq      ) media.seq      = req.body.seq;
    if( req.body.lang     ) media.lang     = req.body.lang;
    if( req.body.subgroup ) media.subgroup = req.body.subgroup;

    //display
    if( req.body.tags ) media.tags = req.body.tags;

    //location
    if( req.body.path ) media.path = req.body.path;
    if( req.body.show ) media.setShow( req.body.show, complete );
    else complete( null, media );

    function complete( err, media ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        console.log(chalk.yellow('Saving...') );
        media.save( function ( err, media ){
            if (err && err.code === 11000) {
                msg = 'Media with that name already exists';
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            } else if (err){
                msg = 'Failed to save new media'
                cosole.log(err.err);
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }
            console.log( media );
            msg = 'Creation of ' + media.name + ' Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg });
        });
    }

};

/**
 * Show Media
 */
exports.read = function(req, res) {
    console.log(chalk.blue('Media Requested'));
    var error;

    if (!req.params.media_name){
        error = new Error('No paramater');
        return complete(error, null);
    }

    console.log(chalk.yellow('Searching for ' + req.params.media_name));
    Media.findOne({ 'name' : req.params.media_name })
         .populate('show')
         .exec(function(err, media) {

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
 * Update Media
 */
exports.update = function(req, res) {
    console.log(chalk.blue('Update for Media Requested'));
    var error;

    if (!req.params.media_name){
        error = new Error('No paramater');
        return complete(error, null);
    }

    console.log(chalk.yellow('Searching for ' + req.params.media_name));
    Media.findOne({ 'name' : req.params.media_name })
        .populate('show').exec(function(err, media){

        if (!media) {
            var error = 'No media with that name exists.';
            return complete( new Error(error) );
        }

        //metadata
        if( req.body.filetype ) media.filetype = req.body.filetype;
        if( req.body.size     ) media.size     = req.body.size;
        if( req.body.length   ) media.length   = req.body.length;
        if( req.body.seq      ) media.seq      = req.body.seq;
        if( req.body.lang     ) media.lang     = req.body.lang;
        if( req.body.subgroup ) media.subgroup = req.body.subgroup;

        //display
        if( req.body.tags ) media.tags = req.body.tags;

        //location
        if( req.body.path ) media.path = req.body.path;
        if( req.body.show ) media.setShow( req.body.show.name, complete );
        else complete( err, media );
    });

    function complete( err, media ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }

        console.log(chalk.yellow('Saving...') );
        media.save( function ( err, media ){
            if (err && err.code === 11000) {
                msg = 'Media with that name already exists.';
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }else if (err){
                msg = 'Failed to save new media'
                cosole.log(err.err);
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }
            console.log(media);
            msg = 'Update of ' + media.name + ' Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg });
        });
    }
};

/**
 * Delete Media
 */
exports.delete = function(req, res) {
    console.log(chalk.blue('Deletion of Media Requested'));
    var error;

    if (!req.params.media_name){
        error = 'No paramater';
        return complete(new Error(error), null);
    }

    console.log(chalk.yellow('Searching for ' + req.params.media_name ) );
    Media.findOne({'name': req.params.media_name}).exec(function(err, media){
        if (!media) {
            error = 'No media with that name exists.';
            return complete(new Error(error), null );
        }
        media.remove(complete);
    });

    function complete( err ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Deletion of ' + req.params.media_name + ' occured without error.';
        console.log(chalk.green(msg));
        res.json({ success: true, message: msg });
    }
};

/**
 * List of Media
 * TODO: Make this more like Show's query method
 */
exports.list = function(req, res) {
    var tag = req.query.tag;
    var all;

    if( tag ){
        console.log(chalk.blue('Listing all Media with ' + tag  + ' tag.'));
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
