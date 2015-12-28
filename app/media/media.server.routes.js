'use strict';
var media = require('./media.server.controller.js');

module.exports = function( app, express ) {
    var mediaRouter = express.Router();

    mediaRouter.route('/media')

    // on routes that end in /shows
    // ----------------------------------------------------
        .post(media.create)

        .get(media.list);

    // on routes that end in /shows/:show_name
    // ----------------------------------------------------
    mediaRouter.route('/media/:media_name')

        .get(media.read)

        .put(media.update)

        .delete(media.delete);

        return mediaRouter;
};
