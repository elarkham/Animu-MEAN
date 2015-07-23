'use strict';
var user = require('../controllers/user.server.controller.js');

module.exports = function( app, express ) {
    var userRouter = express.Router();

    // on routes that end in /users
    // ----------------------------------------------------
    userRouter.route('/users')

        // create a user
        .post(user.create)

        // get all the users
        .get(user.list);

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    userRouter.route('/users/:user_id')

        // get the user with that id
        .get(user.read)

        // update the user with this id
        .put(user.update)

        // delete the user with this id
        .delete(user.delete);

    return userRouter;
};
