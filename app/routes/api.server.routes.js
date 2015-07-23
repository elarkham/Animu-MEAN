'use strict';
var api = require('../controllers/api.server.controller.js');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    //Give token in response to valid user login
    apiRouter.post('/authenticate', api.giveToken );

    //Verify attached token
    apiRouter.use( api.verifyToken );

    apiRouter.get('/me', function(req, res){
        res.send(req.decoded);
    });

    return apiRouter;
};
