'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Show     = mongoose.model('Show');
var Media    = mongoose.model('Media');
var async    = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
var chalk    = require('chalk');

/**
 * Create a Link
 */
exports.add = function(media_name, show_name, callback) {
    console.log(chalk.blue('Adding ' + media_name + ' to ' + show_name));

    async.waterfall([
        function(next){
            Show.find({'name':show_name}).exec( next );
        }, function( show, next ) {
            Media.find({'name':media_name}).exec( function( err, media ){
                next( null, show, media );
            })
        }, function ( show, media, next){
            console.log(show.media);
            if ( !show || !media ) console.log(chalk.red.bold('Query Failed'));
            show.media.push( media._id );
            media.show = show._id;

            show.save( function(err){
                if (err) throw err;
                console.log(chalk.green('Show Link Success'));
            });
            media.save( function(err){
                if (err) throw err;
                console.log(chalk.green('Media Link Success'));
            });
        }
    ], callback );
}
