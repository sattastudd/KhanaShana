/* This is a Database Interaction file Responsible for adding, editing, deleting a Location in a city..
 */

var LocationModelModule = require( '../../../models/locations/locationsModel' );

/* This public method is used to add a new cuisine into system.
 */
var addNewLocation = function( cityName, locationName, callback ){
    console.log( 'In AdminRestaurantDBI | Starting Execution of addNewLocation' );

    var cityDBConnection = utils.getDBConnection( cityName );

    LocationModelModule.setUpConnection( cityDBConnection );
    var LocationModel = LocationModelModule.getLocationModel();

    var Location = new LocationModel({
        name : locationName
    });

    Location.save( function( err, result ){
        if( err ){
            callback( err );
        } else {
            callback( null, result );
        }
    });

    console.log( 'In AdminRestaurantDBI | Finished Execution of addNewLocation' );
};

/* This public method would be used to update location */
var editLocationByName = function( cityName, oldName, newName, callback ){
    console.log( 'In AdminRestaurantDBI | Starting Execution of editLocationByName' );

    var cityDBConnection = utils.getDBConnection( cityName );

    LocationModelModule.setUpConnection( cityDBConnection );
    var LocationModel = LocationModelModule.getLocationModel();

    var query = {
        name : oldName
    };

    var update = {
        $set : {
            name : newName
        }
    };

    LocationModel.update( query, update, function ( err, numberOfRowsEffected ){
        if( err ) {
            callback( err );
        } else {
            callback( null, numberOfRowsEffected );
        }
    });
    console.log( 'In AdminRestaurantDBI | Finished Execution of editLocationByName' );
};

/* This public method would be used to delete a location from the DB.
 * This method needs to make sure that a location can only be deleted if there are no corrosponding entries for it in restaurants DB.
 */
var deleteLocationByName = function( cityName, locationName, callback ) {
    console.log( 'In AdminRestaurantDBI | Starting Execution of deleteLocationByName' );

    var cityDBConnection = utils.getDBConnection( cityName );

    LocationModelModule.setUpConnection( cityDBConnection );
    var LocationModel = LocationModelModule.getLocationModel();

    var query = {
        name : locationName
    };

    LocationModel.findOneAndRemove( query, function ( err, result ){
        if( err ) {
            callback( err );
        }
        else {
            callback( null, result );
        }
    });

    console.log( 'In AdminRestaurantDBI | Finished Execution of deleteLocationByName' );
};

/* This public method would check if a cuisine is already present */
var isLocationNotPresent = function ( cityName, locationName, callback ) {

    console.log( 'In AdminRestaurantDBI | Starting Execution of isLocationNotPresent' );

    var cityDBConnection = utils.getDBConnection( cityName );

    LocationModelModule.setUpConnection( cityDBConnection );
    var LocationModel = LocationModelModule.getLocationModel();

    var query = {
        name : locationName
    };

    LocationModel.findOne( query, function ( err, result ) {
        if( err ) {
            callback ( err );
        } else {
            if( null !== result ){
                callback( null, true );
            } else {
                callback( null, false );
            }
        }
    });

    console.log( 'In AdminRestaurantDBI | Finished Execution of isLocationNotPresent' );

};

/*
 console.log( 'In AdminRestaurantDBI | Starting Execution of methodName' );
 console.log( 'In AdminRestaurantDBI | Finished Execution of methodName' );
 */

exports.addNewLocation = addNewLocation;
exports.editLocationByName = editLocationByName;
exports.deleteLocationByName = deleteLocationByName;
exports.isLocationNotPresent = isLocationNotPresent;