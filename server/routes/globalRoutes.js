var globalDataController = require('../controllers/globalDataController');

/* GET /cities listing. */
/* Request-Name : /public/globalData, Type : Post, Allowed : public*/
router.post('/public/globalData',
    function (req, res, next) {

        console.log('In globalRoutes | Handling ' + req.route.path);

        globalDataController.getGlobalData(req, res, next);

        console.log('In globalRoutes | Completed Processing for '
        + req.route.path);
    });

/* Get Location Listing */
/* Request-Name : /public/locations, Type : Get, Allowed : public*/
router.get('/public/locations', function (req, res, next) {
    console.log('In globalRoutes | Handling ' + req.route.path);

    globalDataController.getAllLocations(req, res, next);

    console.log('In globalRoutes | Completed Processing for '
    + req.route.path);
});