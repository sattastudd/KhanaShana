var Controller = require("../controllers/locations");

/* GET /locations/CityName listing */
router.get('/locations/:CityName', function(req, res, next) {
	Controller.main(req, res, next);
});