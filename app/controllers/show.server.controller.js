'use strict';

/**
 * Module dependencies.
 */
var Show = require('../models/show.server.model.js');
var Media = require('../models/media.server.model.js');

/**
 * Create a Show
 */
exports.create = function(req, res) {
    // create a new instance of the Show model
    var show = new Show();
    show.name = req.body.name;
    show.path = req.body.path;

    show.save(function(err) {
        if (err) {
            // duplicate entry
            if (err.code == 11000)
                return res.json({ success: false, message: 'Show of that name already exists. '});
            else
                return res.send(err);
        }

             // return a message
             res.json({ message: 'Show created!' });
    });

};

/**
 * Show the current Show
 */
exports.read = function(req, res) {
    Show.findOne({ 'name' : req.params.show_name }, function(err, show) {
        if (err) res.send(err);

        // return that show
        res.json(show);
    });
};

/**
 * Update a Show
 */
exports.update = function(req, res) {
    Show.findOne({ 'name' : req.params.show_name }, function(err, show) {

        if (err) res.send(err);

        if (!show) {

            res.json({ success: false, message: 'Show does not exist.'} );

        } else {

            // set the new show information if it exists in the request
            if (req.body.name) show.name = req.body.name;
            if (req.body.path) show.path = req.body.path;
            if (req.body.media) show.addMediaID( req.body.media );

            // save the show
            show.save(function(err) {
                if (err) res.send(err);

                // return a message
                res.json({ success: true, message: 'Show updated!' });
            });
        }

    });
};

/**
 * Delete an Show
 */
exports.delete = function(req, res) {
    Show.remove({
        'name': req.params.show_name
    }, function(err, show) {
        if (err) res.send(err);
        res.json({ message: show.name + ' successfully deleted' });
    });
};

/**
 * List of Shows
 */
exports.list = function(req, res) {
    Show.find().populate("media").exec(function(err, shows) {
        if (err) res.send(err);

        // return the show
        res.json(shows);
    });
};

