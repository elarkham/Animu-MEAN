'use strict';
var show = require('../controllers/show.server.controller.js');

module.exports = function( app, express ) {

    var showRouter = express.Router();
    showRouter.route('/shows')

    // on routes that end in /shows
    // ----------------------------------------------------
        // create a show
        .post(show.create)

        // get all the Shows
        .get(show.list);

    // on routes that end in /shows/:show_name
    // ----------------------------------------------------
    showRouter.route('/shows/:show_name')

        // get the show with that name
        .get(show.read)

        // update the show with that name
        .put(show.update)

        // delete the show with this name
        .delete(show.delete);

    return showRouter;
};
