/* GlobalUtil module is responsible for defining and declaring some variables at the global scope.
 * So that, these variables are accessible easily in other modules.
 * However, this module also facilitates getter and setter methods well, to avoid any error.
 * All the global variables should be defined in here.
 * No direct modification should be done in other modules.
 */

var events = require( 'events' );
var EventEmitter = events.EventEmitter;

var configure = function() {
	console.log( 'Global Variables Configuration Started' );

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
			var allowedRoles = global.requestAuthMap[ requestName ][ requestType ];

			if( typeof allowedRoles === 'undefined' ) {
				return false;
			} else {
				if( allowedRoles.indexOf( 'public' ) >= 0 ) {
					return true;
				} else if( allowedRoles.indexOf( role ) >= 0 ) {
					return true;
				}
				return false;
			}

		}
		catch ( err ) {
			console.log( err )
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
	};

	// Getter to list all the mappings in the map
	global.utils.showAllMappings = function() {

		return JSON.stringify( global.requestAuthMap );
	};
	
	console.log( 'Global Variables Configuration Completed.' );
};

exports.configure = configure;
