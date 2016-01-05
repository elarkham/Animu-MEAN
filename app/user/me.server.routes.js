'use strict';
var user = require('./user.server.controller.js');
var show_history  = require('./internal/user.show_history.controller.js');
var media_history = require('./internal/user.media_history.controller.js');
var queue         = require('./internal/user.queue.controller.js');

module.exports = function( app, express ) {
    var meRouter = express.Router();

    meRouter.route('/me')

        // Adds bulk data to user
        .post(user.push)

        // Get current user with query
        .get(user.read)

        // Update the current user
        .put(user.update)

        // Delete the current user's data
        // except username and password
        .delete(user.reset);

    //============================================
    // Show History
    //
    // pill : { show, date, seq }
    //  - show : show._id - The show watched
    //  - date : Date     - Date last watched
    //  - seq  : Number   - Episode Number
    //============================================
    meRouter.route('/me/show-history')

        // Gets show pill array based on query
        .get(show_history.get)

        // Adds an array of show pills to current user
        .post(show_history.push);

    meRouter.route('/me/show-history/:show_name')

        // Deletes show pill with given show name
        .delete(user.delete);

    //============================================
    // Media History
    //
    // pill : { media, date, prog }
    //  - media : media._id - The media watched
    //  - date  : Date      - Date last watched
    //  - prog  : Number    - Progress in seconds
    //============================================
    meRouter.route('/me/media-history')

        // Gets show pill array based on query
        .get(media_history.get)

        // Adds an array of show pills to current user
        .post(media_history.push);

    meRouter.route('/me/media-history/:media_name')

        // Deletes media pill with given media name
        .delete(media_history.delete);

    //============================================
    // Show Queue
    //
    // pill : { show, prio }
    //  - show : show._id - The show planned
    //  - prio : Number   - Where on the queue
    //============================================
    meRouter.route('/me/queue')

        // Gets queue pill array based on query
        .get(queue.get)

        // Adds an array of queue pills to user's queue
        .post(queue.push);

    meRouter.route('/me/queue/:show_name')

        // Deletes queue pill with given show name
        .delete(queue.delete);

    return meRouter;
};
