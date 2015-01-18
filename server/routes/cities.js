var Controller = require("../controllers/cities");

/* GET /cities listing. */
router.get('/cities', function(req, res, next) {
	Controller.main(req, res, next);
});