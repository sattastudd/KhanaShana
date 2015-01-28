var request = require("request");
var BlueDart = require('../dataTraveller/BlueDart');

/* Cities Controller */

module.exports.main = function(req, res, next){
	request("https://api.mongolab.com/api/1/databases?apiKey=5irxa3M0T6NMJBTSHXlruQ_EOlBgtfx8", 
		function(error, response, body) {

			var blueDart = new BlueDart();

			blueDart.setData(body);
			blueDart.setMessage('OK');
			blueDart.setStatus(200);

  			res.send(blueDart);
		}
	);
};