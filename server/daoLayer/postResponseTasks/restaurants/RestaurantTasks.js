/* This module is supposed to carry out tasks, that should be performed after response has been sent to the client.
 * These tasks involve updatioin of approved restaurant stats.
 */

var appConstants = require( '../../../constants/ServerConstants' );
var StatsModelModule = require('../../../models/stats/stats' );

var RestaurantModelModule = require( '../../../models/restaurant/restaurants' );

var async = require( 'async' );

/* Public method to find count of approved restaurants in the system. */
var getApprovedRestaurantCount = function( cityName, callback ) {
    console.log( 'In RestaurantTasks | Starting execution of getApprovedRestaurantCount' );

    var cityDBConnection = utils.getDBConnection(cityName);

    RestaurantModelModule.setUpConnection(cityDBConnection);
    var RestaurantModel = RestaurantModelModule.getModel();

    var query = {
        approved : true
    };

    RestaurantModel.count( query, function( err, count ) {
       if( err ) {
           callback( err );
       } else {
           callback( null, count );
       }
    });

    console.log( 'In RestaurantTasks | Finished execution of getApprovedRestaurantCount' );
};

/* Private method to update approved restaurant stats in the application. */
var updateApprovedRestaurantCountInSystem = function( totalCount, callback ) {
    console.log( 'In RestaurantTasks | Starting execution of updateApprovedRestaurantCountInSystem' );

    var globalDBConnection = utils.getDBConnection( appConstants.globalDataBase );

    StatsModelModule.setUpConnection( globalDBConnection );
    var StatsModel = StatsModelModule.getModel();

    var update = {
        $set : {
            restaurant_count : totalCount
        }
    };

    StatsModel.update({}, update, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    console.log( 'In RestaurantTasks | Finished execution of updateApprovedRestaurantCountInSystem' );
};

/* Public method to count and update approved restaurant stats. */
var updateRestaurantStats = function( cityName ) {
    console.log( 'In RestaurantTasks | Finished execution of updateRestaurantStats' );

    async.waterfall([
        async.apply( getApprovedRestaurantCount, cityName ),
        updateApprovedRestaurantCountInSystem
    ]);

    console.log( 'In RestaurantTasks | Finished execution of updateRestaurantStats' );
};

exports.updateRestaurantStats = updateRestaurantStats;