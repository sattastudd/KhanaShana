var msg = "<b>Greetings {{userName}} !!!<b>" +
			"<br/>" + 
			"<p>You have been successfully registered. Thank you for being a part of Peturaam.</p" +
			"<br/>" +
			"<p>If you are a taste savy food lover, if exploring various cuisines is what you think you are meant for, then this is crafted just for you.</p>" +
			"<br/>" +
			"<p>You can scroll through all the cuisines in here. We provide information on almost all types of restaurants in your city and neighborhood.</p>" +
			"<br/>" +
			"<p>You can also go through  reviews by other foodies.</p>" +
			"<br/>" +
			"<p>" + "And yes.! Too lazy to step out? Well.! You don't have to. With peturaam you are just a click away from yummylicious food without moving a step. Just log on to us and get your meal deal right at your door. " + "</p>" + 
			"<br/>" +
			"<br/>" +
			"<p>" + "Its always good to be a Peturaam." + "</p>" +
			"<br/>" +
			"<br/>" +
			"Regards," +
			"<br/>" +
			"Team Peturaam";

var getMailContent = function (newUserName) {
    return msg.replace(new RegExp('{{' + 'userName' + '}}', 'i'), newUserName);
};

exports.getMailContent = getMailContent;