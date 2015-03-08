/*
 * Module responsible for extracting and creating a map for the request and
 * accesses.
 */
var credentials = require( './../credentials' );
var fs = require( 'fs' );

var pathReceived = credentials.routeLocation;
var jsPattern = /.js$/;
var requestInfoPattern = /\/\*Request-Name:\/[a-zA-Z\/]{1,},Type:[Post,Get]{1,},Allowed:[a-zA-Z,]{1,}\*\//g;

var requestNamePattern = /Request-Name:\/[a-zA-Z\/]{1,}/g;
var requestTypePattern = /Type:[a-zA-Z]{1,}/g;
var allowedRolesPattern = /Allowed:[a-zA-Z,]{1,}/g;

var addMapping = utils.addMapping;
var showAllMappings = utils.showAllMappings;

var createRequestMap = function() {

	console.log('Mapping Requests to Authorized Roles');

	var filesInDirectory = fs.readdirSync( pathReceived );

	filesInDirectory.forEach( function(fileName) {

		if ( jsPattern.test( fileName ) ) {
			var filePath = pathReceived + '/' + fileName;

			var lines = fs.readFileSync( filePath, "utf-8" );

			lines = lines.split( "\n" );

			lines.forEach( function(line) {

				var compressedLine = line.replace( / /g, '' );

				if ( requestInfoPattern.test( compressedLine ) ) {

					var retrievedRequestName = compressedLine
							.match( requestNamePattern )[0].split( ':' )[1];

					var retrivedRequestType = compressedLine
							.match( requestTypePattern )[0].split( ':' )[1];

					var retrivedRoles = compressedLine
							.match( allowedRolesPattern )[0].split( ':' )[1];

					addMapping( retrievedRequestName, retrivedRequestType
							.toLowerCase(), retrivedRoles );
				}
			} );
		}
	} );

	console.log('Mapping Requests to Authorized Roles Finished');
};

module.exports.createRequestMap = createRequestMap;