var locationController = require("../controllers/locationsController");

/* GET /locations/CityName listing */
router.get('/locations/:CityName', function(req, res, next) {
	console.log('In locationsRoute | Handling ' + req.route.path);

	locationController.getAllLocations(req, res, next);

	console.log('In locationsRoute | Complted Processsing for ' + req.route.path );
});