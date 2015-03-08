/* This modules acts as connection maker to all DBs we are going to use in app.
 * Since, there are more than one DBs to connect to,
 * and the connection opening is an asynchronus process. 
 * We need to make sure that server is started only when all the connection s to DBs have been opened.
 */
var credentials = require( './../credentials' );
var mongoose = require( 'mongoose' );

/* Retrieving global Event Handler */
var eventHandler = utils.getGlobalEventHandler();

/* We need a counter variable here,
 * to keep track of opened connections and yet to be opend.
 * This variable would be updated on a event emit.
 * When variable's value get same as the entries in the globalDB's usedDB collection enties count,
 * We will know its time to start the server using a broadcast.
 * This broadcast would be received in server.js.
 */
var callCount = 0;

eventHandler.on( 'ConnectionEstablished', function( totalCount ) {
	callCount ++;

	if( callCount === totalCount ) {
		/* Broadcast to start the Server */
		eventHandler.emit( 'PleaseStartServerNow' );
	}
	
});

var configure = function() {
	console.log( 'Global DB Connections Configuration Started ');

	var globalDataBaseConnection = mongoose.createConnection(
		credentials.connectionString.global_data );

	var dbConnectionSchema = new mongoose.Schema({
		dbName : String,
		partialConnectionString : String
	});

	var DbConnectionModal = globalDataBaseConnection.model( 'usedDBs', dbConnectionSchema, 'usedDBs' );

	globalDataBaseConnection.on( 'open', function() {
		console.log( 'Connection to GlobalDB has been opened' );

		DbConnectionModal.find( function( err, toBeUsedDbs ){
			console.log( 'Total Available DBs to connect to ' + toBeUsedDbs.length );

			if( toBeUsedDbs.length === 0 ) {
				throw new Error( 'No DBs entries found in DataBase' );
			} else {
				/* Create an array in global object for storing connection
				 * References
				 */
				global.globalDBConnections = [];

				/* Storing current Connection in the global Object with key globalDB
				 */
				global.globalDBConnections.push({
					dbName : 'globalDB',
					connection : globalDataBaseConnection
				});

				/* toBeUsedDbs is an array containing information of DBs we have to connect to.
				 * So, we run a forEach loop to iterate over each of entries.
				 */
				toBeUsedDbs.forEach( function( db ) {

					/* This object would be finally push onto global.globalDBConnections array
					 * and would be identified with key dbName
					 */
					var connectionObject = {
						dbName : db.dbName
					};
					/* Here we are simple storing the connection value in the object.
					 */
					connectionObject.connection = mongoose.createConnection(
									'mongodb://' +
									credentials.mongo.user +
									credentials.mongo.pass +
									db.partialConnectionString );
					
					/* When connection has been opened for this DB entry,
					 * we need to emit event that connection has been opened.
					 * Also, need to push object into global.globalDBConnections array.
					 */
					connectionObject.connection.on( 'open', function() {
						global.globalDBConnections.push( connectionObject );

						console.log( 'Connection opened for ' + connectionObject.dbName + ' database' );

						eventHandler.emit( 'ConnectionEstablished', toBeUsedDbs.length );
					});
				});
			}
		});
	});

	console.log( 'Global DB Connections Configuration finished' );
};

exports.configure = configure;
