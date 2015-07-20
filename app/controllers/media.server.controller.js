'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Show = mongoose.model('Show');
var Media = mongoose.model('Media');
var ObjectId = require('mongoose').Types.ObjectId;

/**
 * Create a Medium
 */
exports.create = function(req, res) {

    //Put everything inside the query callback
    Show.findOne({'name':req.body.show}).exec(function( err, show){

        if (err) res.send(err);

        //create now instance of media model
        var media = new Media();
        media.name = req.body.name;
        media.show = show.id;

        console.log(media.show);
        media.save( function(err){
           if(err) {
                // duplicate entry
                if (err.code == 11000) {
                    return res.json({ success: false, message: 'Media of that name already exists.' });
                } else {
                    return res.send(err);
                }
            }

            res.json({ message: 'Media Created!'});
        });
    });

};

/**
 * Show the current Medium
 */
exports.read = function(req, res) {
    Media.findOne({ 'name' : req.params.media_name }).populate('show').exec(function( err, media ){
        if (err) res.send(err);

        res.json(media);
    });

};

/**
 * Update a Medium
 */
exports.update = function(req, res) {
    Media.findOne({ 'name' : req.params.media_name }, function(err, media) {

        if (err) res.send(err);

        if (!media) {

            res.json({ success: false, message: 'Media does not exist.'} );

        } else {
            // set the new show information if it exists in the request
            if (req.body.name) media.name = req.body.name;
            if (req.body.path) media.show = media.getShowId( req.body.show );

            // save the show
            media.save(function(err) {
                if (err) res.send(err);

                // return a message
                res.json({ success: true, message: 'Media updated!' });
            });
        }

    });
};

/**
 * Delete an Medium
 */
exports.delete = function(req, res) {
    Media.remove({
        'name': req.params.media_name
    }, function(err, media) {
        if (err) res.send(err);
        res.json({ message: media.name + ' successfully deleted' });
    });
};

/**
 * List of Media
 */
exports.list = function(req, res) {
    Media.find().populate('show').exec(function(err, media) {
        if (err) res.send(err);

        // return the show
        res.json(media);
    });
};
