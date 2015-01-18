var request = require("request");
/* Cities Controller */

module.exports.main = function(req, res, next){
	request("https://api.mongolab.com/api/1/databases?apiKey=5irxa3M0T6NMJBTSHXlruQ_EOlBgtfx8", 
		function(error, response, body) {
  			res.send(body);
		}
	);
};