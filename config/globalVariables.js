var events = require( 'events' );

var EventEmiiter = events.EventEmitter;

var configure = function() {

	console.log( 'Configuring Global Variables' );

	// Setting up a global event Handler
	global.eventHandler = new EventEmiiter();

	// Setting up a global Request Authorization Map
	// With Structure As
	// { Request-Name : [ { Request-Type : [Roles-Allowed] }, { Request-Type :
	// [Roles-Allowed]}];
	global.requestAuthMap = {};

	// Setting up a global util object for retriving global objects across
	// modules
	global.utils = {};

	// Getter to get global event handler reference
	global.utils.getEventHandler = function() {

		return global.eventHandler;
	};

	/* Utility method to check if a role is authorized to this request */
	global.utils.isAuthorized = function(requestName, requestType, role) {

		// Return true if is authorized.
		// Else false

		try {
			var allowedRoles = global.requestAuthMap[requestName].requestType.role;

			if ( typeof allowedRoles === 'undefined' ) {
				return false;
			} else {
				if ( allowedRoles.indexOf( 'public' ) >= -1 )
					return true;
				else if ( allowedRoles.indexOf( role ) >= -1 ) {
					return true;
				}
				return false;
			}
		} catch ( err ) {
			console.log( err );
			return false;
		}
	};

	// Setter to add a request mapping to the autorization map
	global.utils.addMapping = function(requestName, requestType, role) {

		var currRequest = global.requestAuthMap[requestName] = {};
		currRequest[requestType] = role;
	};

	// Getter to list all the mappings in the map
	global.utils.showAllMappings = function() {

		return JSON.stringify( global.requestAuthMap );
	};

	// Getter to get DB Connection Object by city name
	global.utils.getDBConnection = function(cityName) {

		var globalConnectionsArray = global.globalConnections;
		var globalConnectionsLength = globalConnectionsArray.length;

		for ( var i = 0; i < globalConnectionsLength; i++ ) {
			var connectionObject = globalConnectionsArray[i];

			if ( connectionObject.cityName === cityName ) {
				return connectionObject.connection;
			}
		}
	};

	console.log( 'Configuring Global Variables Completed' );
};

exports.configure = configure;
