var events = require( 'events' );

var EventEmiiter = events.EventEmitter;

var configure = function () {
	
	console.log( 'Configuring Global Variables' );

	//Setting up a global event Handler
	global.eventHandler = new EventEmiiter();

	//Setting up a global util object for retriving global objects across modules
	global.utils = {};

	//Getter to get global event handler reference
	global.utils.getEventHandler = function(){
		return global.eventHandler;
	};

	//Getter to get DB Connection Object by city name
	global.utils.getDBConnection = function( cityName ) {
		var globalConnectionsArray = global.globalConnections;
		var globalConnectionsLength = globalConnectionsArray.length;

		for ( var i=0; i < globalConnectionsLength; i++ ) {
			var connectionObject = globalConnectionsArray[ i ];

			if ( connectionObject.cityName === cityName ) {
				return connectionObject.connection;
			}
		}
	};

	console.log( 'Configuring Global Variables Completed' );
};

exports.configure = configure;
