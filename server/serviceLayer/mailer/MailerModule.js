/* This moudle is responsible for sending mail.
 * Module would require credentials.js for successful operation.
 */
var mailer = require('nodemailer');

var NewRegistrationTemplate = require('./mail-templates/NewRegistration');

var Credentials = require('../../../Credentials');

var smtpTransport = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: Credentials.mailer.user,
        pass: Credentials.mailer.pass
    }
});

var sendMail = function (to, subject, content) {
    var mailObj = {
        from : Credentials.mailer.user,
        to : to,
        subject : subject,
        html: content
    };
    smtpTransport.sendMail(mailObj, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
};

var sendRegistrationMail = function (userInfo) {
    
    var userName = userInfo.name;
    var userMail = userInfo.email;
    
    var mailHtmlContent = NewRegistrationTemplate.getMailContent(userName);

    sendMail(userMail, 'Welcome to PetuRaam !', mailHtmlContent);
};

exports.sendRegistrationMail = sendRegistrationMail;