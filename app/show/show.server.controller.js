'use strict';
/**
 * Module Dependencies
 */
var Show     = require('../show/show.server.model.js');
var Media    = require('../media/media.server.model.js');
var ObjectId = require('mongoose').Types.ObjectId;
var chalk    = require('chalk');

/**
 * Create Show
 */
exports.create = function(req, res) {
    console.log(chalk.blue('Creation of new Show requested'));
    var show = new Show();
    var error;

    //make sure name was included
    if( !req.body.name ){
        error = new Error('Show Name Required');
        console.log(chalk.red.bold(error));
        return complete( error, null );
    } else {
        show.name = req.body.name;
    }

    //display
    if( req.body.path     ) show.path     = req.body.path;
    if( req.body.alt_name ) show.alt_name = req.body.alt_name;
    if( req.body.tags     ) show.tags     = req.body.tags;

    //metadata
    if( req.body.mal_id          )  show.mal_id          = req.body.mal_id;
    if( req.body.status          )  show.status          = req.body.status;
    if( req.body.episode_count   )  show.episode_count   = req.body.episode_count;
    if( req.body.episode_length  )  show.episode_length  = req.body.episode_length;
    if( req.body.cover_image     )  show.cover_image     = req.body.cover_image;
    if( req.body.synopsis        )  show.synopsis        = req.body.synopsis;
    if( req.body.started_airing  )  show.started_airing  = req.body.started_airing;
    if( req.body.finished_airing )  show.finished_airing = req.body.finished_airing;
    if( req.body.rating          )  show.rating          = req.body.rating;
    if( req.body.age_rating      )  show.age_rating      = req.body.age_rating;
    if( req.body.genres          )  show.genres          = req.body.genres;

    console.log(chalk.yellow('Saving...') );
    show.save( function ( err, show ){
       // duplicate entry
       if ( err && err.code === 11000) {
           error = new Error('Show with that name already exists.');
           return complete( error, null );
       }
       complete( err, show );
    });

    function complete( err, show ){
        var msg;
        if (err){
            msg = 'Failed to save new Show';
            console.log(err.err)
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Creation of ' + show.name + ' Successfull!';
        console.log( chalk.green( msg ) );
        return res.json({ success: true, message: msg });
    }

};

/**
 * Show a Show
 */
exports.read = function(req, res) {
    console.log(chalk.blue('Show Requested'));
    var error;

    if (!req.params.show_name) {
        error = new Error('No paramater');
        return complete(error, null);
    }

    //You need valid id in the query and it needs to be inside an id object
    var re = new RegExp('^[a-fA-F0-9]{24}$');
    var objId = new ObjectId( !re.test(req.params.show_name) ?
                '123456789012' : req.params.show_name );

    //I want the name and the id to work in the url. The id is needed if
    //the name is not url safe and needs to be modified manually.
    console.log(chalk.yellow('Searching for ' + req.params.show_name));
    Show.findOne().or([{'name': req.params.show_name }, {'_id': objId }])
                  .populate('media')
                  .exec(function(err, show) {

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
        msg = 'Sent ' + req.params.show_name;
        console.log( chalk.green( msg ) );
        return res.json( show );
    }

};

/**
 * Update Show
 */
exports.update = function(req, res) {
    console.log(chalk.blue('Updating for Show Requested'));
    var error;

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
    console.log(chalk.yellow('Searching for ' + req.params.show_name));
    Show.findOne().or([{'name': req.params.show_name }, {'_id': objId }])
                  .exec(function(err, show) {

        if (!show) {
            error = new Error('No show with that name or id exists.');
            return complete( error, null );
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

        complete(err, show);
    });

    function complete( err, show ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        show.save( function ( err, show ){
            if ( err && err.code === 11000) {
                error = new Error('Show with that name already exists.');
                return complete( error, null );
            } else if (err){
                msg = 'Failed to save new Show'
                cosole.log(err.err);
                console.log( chalk.red.bold( msg ) );
                return res.json({ success: false, message: msg });
            }
            console.log(show);
            msg = 'Update of ' + show.name + ' Successfull!';
            console.log( chalk.green( msg ) );
            return res.json({ success: true, message: msg });
        });
    }
};

/**
 * Delete Show
 */
exports.delete = function(req, res) {
    console.log(chalk.blue('Deletion Requested'));
    var error;

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
    console.log(chalk.yellow('Searching for ' + show_name ) );
    Show.findOne().or([{'name': req.params.show_name }, {'_id': objId }])
        .exec(function(err, show) {

        if (!show) {
            error = new Error('No show with that name or id exists.');
            return complete( error );
        }
        show.remove(complete);
    });

    function complete( err ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Deletion of ' + req.params.show_name + ' occured without error.';
        console.log(chalk.green(msg));
        res.json({ success: true, message: msg });
    }

};

/**
 * Query Shows
 */
exports.query = function(req, res) {
    console.log(chalk.bold.magenta('Received Show Query'));
    console.log(req.query);

    var tags     = req.query.tags;
    var excludes = req.query.excludes;
    var limit    = req.query.limit;
    var sort     = req.query.sort;
    var order    = req.query.order
    var load     = req.query.load;

    var query    = Show.find();
    console.log(chalk.blue(' -Listing all Shows.'));

    /*** Query Object Fields
     *
     * 'tags[]'    : String  -All with Tag Group
     * 'excludes[]': String  -All without Tag Group
     * 'limit'     : Number  -How many to return
     * 'load'      : String  -How many fields to send back
     * 'sort'      : String  -What field to sort the query by
     * 'order'     : Number  -In Ascending or Descending order?
     *
     ****/

    // Query Tags
    // TODO: Allow an array of tags
    if( tags ){
        console.log(chalk.blue(' -Only Shows with tags: '
                    + chalk.yellow.bold(tags) ));

        query = query.in('tags', tags);
    }


    // Query Load Type
    // TODO: Simplify this out by allowing an array containing all of the 'Selects'
    if ( load === 'light' ){
        console.log(chalk.blue(' -Sending a '
                    + chalk.bold.yellow('light') + ' load'));

        query = query.select('name cover_image tags created_at path')
    }

    // Query Excludes
    // TODO: Allow an array of excludes
    if( excludes ){
        console.log(chalk.blue(' -Excluding Shows with tags: '
                    + chalk.bold.yellow(excludes) ));

        query = query.nin('tags', excludes);
    }

    // Query Sort and Order
    // TODO: Add more sort options and clean this up.
    if( !sort  ) sort  = "created_at";
    if( !order ) order = -1;

    var order_title = ( order_title === 1 ) ? "ascending" : "descending";

    console.log(chalk.blue(' -Sorted by '
                + chalk.bold.yellow( sort )  + ' in '
                + chalk.bold.yellow( order ) + ' Order'));

    order = parseInt(order);
    query = query.sort({sort:order});

    // Query Limit
    if( limit ){
        console.log(chalk.blue(' -Limited to '
                    + chalk.bold.yellow(limit) + ' Shows'));
        query = query.limit( parseInt(limit) );
    }

    // Load the Query
    console.log(query);
    query.exec(function(err, shows) {
        if (err) console.log(chalk.red(err.message));
        else res.json(shows);
    });
};

