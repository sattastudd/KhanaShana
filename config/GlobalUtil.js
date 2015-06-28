/* GlobalUtil module is responsible for defining and declaring some variables at the global scope.
 * So that, these variables are accessible easily in other modules.
 * However, this module also facilitates getter and setter methods well, to avoid any error.
 * All the global variables should be defined in here.
 * No direct modification should be done in other modules.
 */

var events = require( 'events' );
var EventEmitter = events.EventEmitter;

var logger = require( './PetuLogger' );

var configure = function() {

    /* Setting up a global logger in the application. */
    global.logger = logger;

	logger.info( 'Global Variables Configuration Started' );

	/* Setting up a global Event Handler */
	global.eventHandler = new EventEmitter();

	/* Setting up a global utils object for retriving global objects.
	 * All the global utilities, getter and setter would be defined in it.
	 */
	global.utils = {};

	/* Setting up a global blackList tokens list.
	 * Once a user has logged out.
	 * We have to use put that token into blacklist mode.
	 */
	global.blackListTokens = {};
	
	/* Setting up a global Request Authorization Map
	 * With Structure As
	 * { Request-Name : [ { Request-Type : [Roles-Allowed] }, { Request-Type :
	 * [Roles-Allowed]}];
	 */
	global.requestAuthMap = {};

    /* Setting up an extra global Request Authorization Map.
     * This map differs from global.requestAuthMap as this map would contain named requests.
     * Given the current architecture and authorization mode, it would be difficult to accommodate in current map.
     * Structure would be same as the previous map.
     */
    global.nammedRequestAuthMap = {};

	/* Getter method to retrieve a global Event Handler Reference*/
	global.utils.getGlobalEventHandler = function() {
		return global.eventHandler;
	};

	/* Getter method to retrieve DB Connection by dbName */
	global.utils.getDBConnection = function( dbName ) {
		
		var globalConnectionsArray = global.globalDBConnections;
		var globalConnectionSize = globalConnectionsArray.length;

		for( var i=0; i < globalConnectionSize; i++ ) {
			var connectionObject = globalConnectionsArray[ i ];

			if( connectionObject.dbName === dbName ) {
				return connectionObject.connection;
			}
		}
	};

	/* Getter method to check if a token is in blacklist */
	global.utils.isBlackListedToken = function( token ) {
		if( typeof global.blackListTokens[token] === 'undefined' ) {
			return false;
		}

		return global.blackListTokens[ token ];
	};

	/* Setter method to push a token into the list*/
	global.utils.setBlackListed = function( token ) {
		global.blackListTokens[token] = true;
	};
	
	/* Utility Method to check if a role is authorized to this request */
	global.utils.isAuthorized = function( requestName, requestType, role ) {
		/* Return true if is authorized,
		 * else false.
		 */

		try{
            if( typeof global.requestAuthMap[ requestName ] !== 'undefined' ) {
                var allowedRoles = global.requestAuthMap[requestName][requestType];

                if (typeof allowedRoles === 'undefined') {
                    return false;
                } else {
                    if (allowedRoles.indexOf('public') >= 0) {
                        return true;
                    } else if (allowedRoles.indexOf(role) >= 0) {
                        return true;
                    } else if( allowedRoles.toLowerCase().indexOf( role ) >= 0 ) {
                        return true;
                    }
                    return false;
                }
            } else {

                /* If we are in this section, then it is possible that we are dealing with named parameter requests.
                 * Since, our namedRequestMap doesn't stores named params, we would have to remove string that comes
                 * after last "/" in the request name.
                 */

                var reducedRequestName = requestName.substr(0, requestName.lastIndexOf( '/' ) + 1);

                if( typeof global.nammedRequestAuthMap[ reducedRequestName ] !== 'undefined' ) {

                    var allowedRoles = global.nammedRequestAuthMap[ reducedRequestName ][ requestType ];

                    if (typeof allowedRoles === 'undefined') {
                        return false;
                    } else {
                        if (allowedRoles.indexOf('public') >= 0) {
                            return true;
                        } else if (allowedRoles.indexOf(role) >= 0) {
                            return true;
                        } else if (allowedRoles.toLowerCase().indexOf(role) >= 0 ) {
                            return true;
                        }
                        return false;
                    }

                }

                return false;
            }
		}
		catch ( err ) {
			logger.error( err );
			return false;
		}
	};

	// Setter to add a request mapping to the autorization map
	global.utils.addMapping = function(requestName, requestType, role) {

		var currRequest;

		if ( typeof global.requestAuthMap[requestName] === 'undefined') {
			currRequest = global.requestAuthMap[requestName] = {};
		} else {
			currRequest = global.requestAuthMap[requestName];
		}

		currRequest[requestType] = role;

		logger.info('Added { ' + requestName + ' : ' + ' { ' + requestType + ' : ' + role + ' } }');
	};

    // Setter to add a request to namedRequestAuthorization Map.
    global.utils.addMappingToNamedRequests = function( requestName, requestType, role ) {

        var currRequest;

        if ( typeof global.nammedRequestAuthMap[ requestName ] === 'undefined' ) {
            currRequest = global.nammedRequestAuthMap[ requestName ] = {};
        } else {
            currRequest = global.nammedRequestAuthMap[ requestName ];
        }

        currRequest[ requestType ] = role;

        logger.info( 'Added to Named Requests { ' + requestName + ' : ' + ' { ' + requestType + ' : ' + role + ' } }');
    };

	// Getter to list all the mappings in the map
	global.utils.showAllMappings = function() {

		return JSON.stringify( global.requestAuthMap );
	};
	
	logger.info( 'Global Variables Configuration Completed.' );
};

exports.configure = configure;
