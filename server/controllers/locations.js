var mongoose = require('mongoose');
var Locations = require("../models/locations");
/* Cities Controller */


module.exports.main = function(req, res, next){
	mongoose.connection.useDb(req.params.CityName);
    Locations.find({}, { '_id': 0}, function (err, locations) {
    	if (err) res.send(err);
    	res.json(locations);
  	});
};