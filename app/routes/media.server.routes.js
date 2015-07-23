'use strict';
var media = require('../controllers/media.server.controller.js');

module.exports = function( api ) {

    var apiRouter = api;
    apiRouter.route('/media')

    // on routes that end in /shows
    // ----------------------------------------------------
        // create a show
        .post(media.create)

        // get all the Shows
        .get(media.list);

    // on routes that end in /shows/:show_name
    // ----------------------------------------------------
    apiRouter.route('/media/:media_name')

        // get the show with that name
        .get(media.read)

        // update the show with that name
        .put(media.update)

        // delete the show with this name
        .delete(media.delete);

        return apiRouter;
};
