'use strict';
var show = require('../controllers/show.server.controller.js');

module.exports = function( api ) {

    var apiRouter = api;
    apiRouter.route('/shows')

    // on routes that end in /shows
    // ----------------------------------------------------
        // create a show
        .post(show.create)

        // get all the Shows
        .get(show.list);

    // on routes that end in /shows/:show_name
    // ----------------------------------------------------
    apiRouter.route('/shows/:show_name')

        // get the show with that name
        .get(show.read)

        // update the show with that name
        .put(show.update)

        // delete the show with this name
        .delete(show.delete);

    return apiRouter;
};
