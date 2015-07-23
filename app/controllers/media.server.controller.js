'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Show     = mongoose.model('Show');
var Media    = mongoose.model('Media');
var ObjectId = require('mongoose').Types.ObjectId;
var chalk    = require('chalk');

/**
 * Create a Medium
 */
exports.create = function(req, res) {
    console.log(chalk.blue('Creating new media'));

    //Put everything inside the query callback
    Media.findOne({'name':req.body.name}).exec(function( err, media ){

        // if the show doesn't exist
        if (!media){
            var error = 'No media with that name exists.';
            res.json({success: false, message: error});
            console.log(chalk.bold.red('Error: ' + error));
            return;

        } if (err) res.send(err);

        //create now instance of media model
        media = new Media();
        media.name = req.body.name;
        media.show = req.body.show;

        console.log(media.show);
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
            // return a message
            var msg = 'Media: ' + media.name + ' created!';
            res.json({ success: true, message: msg });
            console.log(chalk.green(msg));
        });
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
    Media.findOne({ 'name' : req.params.media_name }, function(err, media) {

        if (!media) {
            var error = 'No media with that name exists.';
            console.log(chalk.bold.red(error));
            res.json({ success: false, message: error } );
            return;

        } else if (err) res.send(err);

        // set the new show information if it exists in the request
        if (req.body.name) media.name = req.body.name;
        if (req.body.path) media.show = req.body.show;

        // save the show
        media.save(function(err) {
            if (err) res.send(err);

            // return a message
            res.json({ success: true, message: 'Media updated!' });
       });

    });
};

/**
 * Delete an Medium
 */
exports.delete = function(req, res) {
    console.log(chalk.blue('Deleting ' + req.params.media_name ));
    Media.remove({ 'name': req.params.media_name}, function(err) {
        if (err) res.send(err);

        // Mongodb can delete things that don't exist, can only confirm an error didn't occur.
        var msg = 'Deletion of ' + req.params.media_name + ' occured without error.';
        console.log(chalk.green(msg));
        res.json({ success: true, message: msg });
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
