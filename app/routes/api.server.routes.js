var api = require('../controllers/api.server.controller.js');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    //Give token in response to valid user login
    apiRouter.post('/authenticate', api.giveToken );

    //Verify attached token
    apiRouter.use( api.verifyToken );

    apiRouter.use( '/', function(req, res) {
        res.json({ message: "Welcome to the API!"})
    });

    return apiRouter;
};
