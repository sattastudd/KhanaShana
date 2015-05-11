/* This moudle is responsible for sending mail.
 * Module would require credentials.js for successful operation.
 */
var Mailgun = require('mailgun-js');

var NewRegistrationTemplate = require('./mail-templates/NewRegistration');

var Credentials = require('../../../credentials');

var sendMail = function (to, subject, content) {
    var mailGun = new Mailgun({
        apiKey: Credentials.mailer.apiKey, 
        domain: Credentials.mailer.domain
    });

    var mailObj = {
        from : Credentials.mailer.from,
        to : ( Credentials.environSetUp === 'development' ? 'peturaam.mail@gmail.com' : to ),
        subject : subject,
        html: content
    };

    mailGun.messages().send(mailObj, function (err, body) {
        console.log( err );
        console.log( body );
    });
};

var sendRegistrationMail = function (userInfo) {
    
    var userName = userInfo.name;
    var userMail = userInfo.email;
    
    var mailHtmlContent = NewRegistrationTemplate.getMailContent(userName);

    sendMail(userMail, 'Welcome to PetuRaam !', mailHtmlContent);
};

exports.sendRegistrationMail = sendRegistrationMail;
