'use strict';
var api = require('../controllers/api.server.controller.js');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    //Give token in response to valid user login
    apiRouter.post('/authenticate', api.giveToken );

    //Verify attached token
    apiRouter.use( api.verifyToken );

    apiRouter.use( '/test', function(req, res) {
        res.json({ message: 'Welcome to the API!'});
    });

    var userRouter = require('./user.server.routes.js')(apiRouter);
    var showRouter = require('./show.server.routes.js')(apiRouter);
    var mediaRouter = require('./media.server.routes.js')(apiRouter);

    apiRouter.use( userRouter );
    apiRouter.use( showRouter );
    apiRouter.use( mediaRouter );

    return apiRouter;
};
