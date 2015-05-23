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

var levels = {
    info: 0,
    error: 1,
    warning: 2,
    audit: 3
};

var colors = {
    info: 'blue',
    error: 'red',
    warning: 'yellow',
    audit: 'green'
};

/* We can't configure a winston logger to listen to only one specific kind of log.
 * So, it is necessary that we have a different logger for each kind of log.
 */

var consoleLogger = new ( winston.Logger )( {
    levels : levels, transports : [ new ( winston.transports.Console)( {
        level : 'info', prettyPrint : true, colorize : true, silent : false
    } ), ], colors : colors
} );

var accessLogger = new ( winston.Logger )( {
    levels : levels, transports : [ new ( winston.transports.File )( {
        filename : './logs/access-log.log',
        prettyPrint : true,
        level : 'info',
        silent : false,
        colorize : true,
        maxsize : 40000,
        maxFiles : 10,
        json : true,
        tailable : true
    } ) ]
} );

var infoLogger = new ( winston.Logger )( {
    levels : levels, transports : [

        new ( winston.transports.File )( {
            filename : './logs/info-log.log',
            prettyPrint : false,
            level : 'info',
            silent : false,
            colorize : true,
            maxsize : 40000,
            maxFiles : 10,
            json : true,
            tailable : true
        } ) ],

    colors : colors
} );

var errorLogger = new ( winston.Logger )( {
    levels : levels, transports : [

        new (winston.transports.File)( {
            filename : './logs/error-log.log',
            prettyPrint : false,
            level : 'error',
            silent : false,
            colorize : true,
            maxsize : 40000,
            maxFiles : 10,
            json : true,
            tailable : true
        } ) ], colors : colors
} );

var warningLogger = new ( winston.Logger )( {
    levels : levels, transports : [ new (winston.transports.File)( {
        filename : './logs/warning-log.log',
        prettyPrint : false,
        level : 'warning',
        silent : false,
        colorize : true,
        maxsize : 40000,
        maxFiles : 10,
        json : true,
        tailable : true
    } ) ], colors : colors
} );

var auditLogger = new ( winston.Logger )( {
    levels : levels, transports : [ new (winston.transports.File)( {
        name : 'auditLog',
        filename : './logs/audit-log.log',
        prettyPrint : false,
        level : 'audit',
        silent : false,
        colorize : true,
        maxsize : 40000,
        maxFiles : 10,
        json : true,
        tailable : true
    } ) ], colors : colors
} );

var logger = {};

logger.access = function( message ) {
    consoleLogger.info( message );
    accessLogger.info( message, { timestamp : Date.now() });
};

logger.info = function( message ) {
    consoleLogger.info( message );
    infoLogger.info( message, { timestamp : Date.now() } );
};

logger.warning = function( message ) {
    consoleLogger.warning( message );
    warningLogger.warning( message, { timestamp : Date.now() } );
};

logger.error = function( message ) {
    consoleLogger.error( message );
    errorLogger.error( message, { timestamp : Date.now() } );
};

logger.audit = function( message ) {
    consoleLogger.audit( message );
    auditLogger.audit( message, { timestamp : Date.now() } );
};

module.exports = logger;