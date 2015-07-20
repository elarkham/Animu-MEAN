
module.exports = function( app, express ) {
    var user = require('../controllers/user.server.controller.js');
    var apiRouter = express.Router();

    // on routes that end in /users
    // ----------------------------------------------------
    apiRouter.route('/users')

        // create a user
        .post(user.create)

        // get all the users
        .get(user.list);

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id')

        // get the user with that id
        .get(user.read)

        // update the user with this id
        .put(user.update)

        // delete the user with this id
        .delete(user.delete);

        return apiRouter;
}
