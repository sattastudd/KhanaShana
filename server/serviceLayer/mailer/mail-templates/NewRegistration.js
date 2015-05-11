var msg = "<div style=\"font-family :  'Segoe UI', Calibri\">" +
    "<b style=\"font-size : 20px\">Greetings {{userName}} !!!</b>" +
    "<br/>" +
    "<p>You have been successfully registered. Thank you for being a part of <b>Peturaam</b>." +
    "<p>If you are a taste savy food lover, if exploring various cuisines is what you think you are meant for, then this is crafted just for you.</p>" +
    "<p>You can scroll through all the cuisines in here. We provide information on almost all types of restaurants in your city and neighborhood.</p>" +
    "<p>You can also go through  reviews by other foodies.</p>" +
    "<p>And yes.! Too lazy to step out? Well.! You don't have to. With peturaam you are just a click away from yummylicious food without moving a step. Just log on to us and get your meal deal right at your door. </p>" +
    "<p>Visit <a href=\"http://peturaam.com\">PetuRaam</a> for more mouthwatering food and offers.</p>" +
    "<p>Its always good to be a <b>Peturaam</b>.</p>Regards,<br/>Team Peturaam" +
    "</div>";

var getMailContent = function (newUserName) {
    return msg.replace(new RegExp('{{' + 'userName' + '}}', 'i'), newUserName);
};

exports.getMailContent = getMailContent;