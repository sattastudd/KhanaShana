/* This moudle is supposed to carry out tasks, that should be performed after response has been sent to the client.
 * These tasks involve updation of user account stats.
 */

var appConstants = require( '../../../constants/ServerConstants' );
var StatsModelModule = require('../../../models/stats/stats' );
var UserModelModule = require('../../../models/login/usersModel' );

var async = require( 'async' );

/* Private method to count number of users' in the system. */
var countUsersInSystem = function ( callback ) {
    console.log( 'In AccountTasks | Starting Execution of countUsersInSystem' );

    var appUsersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

    UserModelModule.setUpConnection( appUsersDBConnection );
    var UsersModel = UserModelModule.getUsersModel();

    var query = {
        role : 'user'
    };

    UsersModel.count(query, function( err, count ) {
       if( err ){
           callback( err );
       } else {
           callback( null, count );
       }
    });   

    console.log( 'In AccountTasks | Finished Execution of countUsersInSystem' );
};

/* Private method to update count in stats */
var updateUserStats = function( totalUsers, callback ){
    console.log( 'In AccountTasks | Starting Execution of updateUserStats' );

    var globalDBConnection = utils.getDBConnection( appConstants.globalDataBase );

    StatsModelModule.setUpConnection( globalDBConnection );
    var StatsModel = StatsModelModule.getModel();

    var update = {
        $set : {
            users_count : totalUsers
        }
    };

    console.log( update );

    StatsModel.update({}, update, function( err, updated ){
        console.log( err );
        console.log( updated );
    });

    console.log( 'In AccountTasks | Finished Execution of updateUserStats' );
};

/* Public method to update the stats of the application.*/
var updateAppStats = function () {
    console.log( 'In AccountTasks | Starting Execution of updateAppStats' );

    async.waterfall([countUsersInSystem, updateUserStats]);
    console.log( 'In AccountTasks | Finished Execution of updateAppStats' );
};

exports.updateAppStats = updateAppStats;