'use strict';

/**
 * Module dependencies.
 */
var Show  = require('../models/show.server.model.js');
var Media = require('../models/media.server.model.js');
var chalk = require('chalk');

/**
 * Create a Show
 */
exports.create = function(req, res) {
    console.log(chalk.blue("Creating new show"));

    // if a name isn't included
    if (!req.body.name) {
        var error = "You must include a name."
        res.json({success: "false", message: error});
        console.log(chalk.bold.red('Error: ' + error));
        return;
    }
    // create a new instance of the Show model
    var show = new Show();
    show.name = req.body.name;
    show.path = req.body.path;

    show.save(function(err) {
        if (err) {
            // duplicate entry
            if (err.code == 11000) {
                var error = "Show of that name already exists.";
                console.log(chalk.bold.red(error));
                return res.json({ success: false, message: error });
            } else
                return res.send(err);
        }

        // return a message
        var msg = "Show: " + show.name + " created!";
        res.json({ success: true, message: msg });
        console.log(chalk.green(msg));
    });

};

/**
 * Show the current Show
 */
exports.read = function(req, res) {
    console.log(chalk.blue("Getting show with name: " + req.params.show_name));
    Show.findOne({ 'name' : req.params.show_name }, function(err, show) {

        // if the show doesn't exist
        if (!show){
            var error = "No show with that name exists.";
            res.json({success: "false", message: error});
            console.log(chalk.bold.red('Error: ' + error));
            return;

        }if (err) res.send(err);

        // return that show
        res.json(show);
        console.log(chalk.green("Returning " + req.params.show_name));
    });
};

/**
 * Update a Show
 */
exports.update = function(req, res) {
    console.log(chalk.blue("Updating show"));
    Show.findOne({ 'name' : req.params.show_name }, function(err, show) {

        // if the show doesn't exist
        if (!show){
            var error = "No show with that name exists.";
            res.json({success: "false", message: error});
            console.log(chalk.bold.red('Error: ' + error));
            return;

        }if (err) res.send(err);

         else {

            // set the new show information if it exists in the request
            if (req.body.name) show.name = req.body.name;
            if (req.body.path) show.path = req.body.path;
            if (req.body.media) show.addMediaID( req.body.media );

            // save the show
            show.save(function(err) {
                if (err) res.send(err);

                // return a message
                var msg = "Show: " + show.name + " was updated!";
                res.json({ success: true, message: msg });
                console.log(chalk.green(msg));
            });
        }

    });
};

/**
 * Delete an Show
 */
exports.delete = function(req, res) {
    console.log(chalk.blue("Deleting " + req.params.show_name ));
    Show.findOne({ 'name': req.params.show_name }).remove().exec(function(err, show) {
        if (err) res.send(err);

        // Mongodb can delete things that don't exist, can only confirm an error didn't occur.
        var msg = "Deletion of " + req.params.show_name + " occured without error.";
        console.log(chalk.green(msg));
        res.json({ success: true, message: msg });
    });
};

/**
 * List of Shows
 */
exports.list = function(req, res) {
    console.log(chalk.blue("Listing all Shows."));
    Show.find().populate("media").exec(function(err, shows) {
        if (err) res.send(err);

        // return the show
        res.json(shows);
    });
};

