'use strict';
var user          = require('./user.server.controller.js');
var show_history  = require('./internal/user.show_history.controller.js');
var media_history = require('./internal/user.media_history.controller.js');
var queue         = require('./internal/user.queue.controller.js');

module.exports = function( app, express ) {
    var userRouter = express.Router();

    userRouter.route('/users')

        // Create new user
        .post(user.create)

        // Get all users
        .get(user.list);

    userRouter.route('/users/:user_id')

        // Get the user with this id
        .get(user.read)

        // Update the user with this id
        .put(user.update)

        // Delete the user with this id
        .delete(user.delete);

        // Adds bulk data user with this id
        //.post(user.push);

    //============================================
    // Show History
    //
    // pill : { show, date, seq }
    //  - show : show._id - The show watched
    //  - date : Date     - Date last watched
    //  - seq  : Number   - Episode Number
    //============================================
    userRouter.route('/users/:user_id/show-history')

        // Gets show pill array based on query
        .get(show_history.get)

        // Adds an array of show pills
        .post(show_history.push);

    userRouter.route('/users/:user_id/show-history/:show_name')

        // Deletes show pill with given show name
        .delete(show_history.delete);

    //============================================
    // Media History
    //
    // pill : { media, date, prog }
    //  - media : media._id - The media watched
    //  - date  : Date      - Date last watched
    //  - prog  : Number    - Progress in seconds
    //============================================
    userRouter.route('/users/:user_id/media-history')

        // Gets show pill array based on query
        .get(media_history.get)

        // Adds an array of show pills
        .post(media_history.push);

    userRouter.route('/users/:user_id/media-history/:media_name')

        // Deletes media pill with given media name
        .delete(media_history.delete);

    //============================================
    // Show Queue
    //
    // pill : { show, prio }
    //  - show : show._id - The show planned
    //  - prio : Number   - Where on the queue
    //============================================
    userRouter.route('/users/:user_id/queue')

        // Gets queue pill array based on query
        .get(queue.get)

        // Adds an array of queue pills to user's queue
        .post(queue.push);

    userRouter.route('/users/:user_id/queue/:show_name')

        // Deletes queue pill with given show name
        .delete(queue.delete);

    return userRouter;
};
