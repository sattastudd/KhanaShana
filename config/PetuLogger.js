/* Custom logging module
 * to write appropriate logs into log files as well as console.
 */

var winston = require( 'winston' );

winston.setLevels({
    info: 0,
    error: 1,
    warning: 2,
    audit: 3
});

winston.addColors({
    info: 'blue',
    error: 'red',
    warning: 'yellow',
    audit: 'green'
});

var logger = new ( winston.Logger )({
    levels: {
        info: 0,
        error: 1,
        warning: 2,
        audit: 3
    },

    transports : [
        new (winston.transports.Console)({
            level: 'info',
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: true
        }),

        new (winston.transports.File)({
            name : 'infoLogger',
            filename : './logs/info-log.log',
            prettyPrint: false,
            level: 'info',
            silent: false,
            colorize: true,
            timestamp: true,
            maxsize: 40000,
            maxFiles: 10,
            json: false,
            tailable : true
        }),

        new (winston.transports.File)({
            name : 'errorLogger',
            filename : './logs/error-log.log',
            prettyPrint : false,
            level : 'error',
            silent : false,
            colorize : true,
            timestamp : true,
            maxsize : 40000,
            maxFiles : 10,
            json : false,
            tailable : true
        }),

        new (winston.transports.File)({
            name : 'warningLogger',
            filename : './logs/warning-log.log',
            prettyPrint : false,
            level : 'warning',
            silent : false,
            colorize : true,
            timestamp : true,
            maxsize : 40000,
            maxFiles : 10,
            json : false,
            tailable : true
        }),

        new (winston.transports.File)({
            name : 'auditLog',
            filename : './logs/audit-log.log',
            prettyPrint : false,
            level : 'audit',
            silent : false,
            colorize : true,
            timestamp : true,
            maxsize : 40000,
            maxFiles : 10,
            json : false,
            tailable : true
        })
    ],

    colors: {
        info: 'blue',
        error: 'red',
        warning: 'yellow',
        audit: 'green'
    }
});

module.exports = logger;