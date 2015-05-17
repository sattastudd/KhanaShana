/* This DBI file would handle all users related functionality.
 */

var appConstants = require( '../../../constants/ServerConstants' );
var UsersModelModule = require( '../../../models/login/usersModel' );

var LoginDBI = require( '../../login/LoginDBI' );

var DBUtils = require( '../../util/DBIUtil' );
var async = require( 'async' );

/*                              Private Methods                         */
/*======================================================================*/
/* Private method to strip properties unnecessary properties like id and details.
 */
var stripObjectProperties = function (newUser) {
    var toReturn = {};

    toReturn.name = newUser.name;
    toReturn.email = newUser.email;

    return toReturn;
};

/* Private method to generate password. */
/* Does nothing right now.*/
/* Need to return a password. */
var getSecureRandomPassword = function() {
    return 'tata@1234';
};

/*Private method to execute query.
 *This would only be executed if there is we have first time search.
 */
var getUserCount = function( searchParams, query, callback ) {
    console.log( 'In UsersDBI | Starting Execution of getUserCount' );

    var appUsersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

    UsersModelModule.setUpConnection( appUsersDBConnection );
    var UsersModel = UsersModelModule.getUsersModel();

    UsersModel.count(query, function( err, count ){
        if( err ) {
            callback( err );
        } else {
            callback( null, count );
        }
    });
    console.log( 'In UsersDBI | Finished Execution of getUserCount' );
};

/* Private method to search or first retrieval of data.
 * This method would only be called in first call of search.
 */
var getUserListForFirstTime = function( searchParam, pagingParams, query, projection, callback ){

    console.log( 'In UsersDBI | Starting Execution of getUserListForFirstTime' );

    var appUsersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

    UsersModelModule.setUpConnection( appUsersDBConnection );
    var UsersModel = UsersModelModule.getUsersModel();

    var options = {
        sort : {
            profile_created_date : 'desc'
        }
    };

    if( pagingParams.startIndex != null ){
        options.skip = pagingParams.startIndex;
        options.limit = 10;
    };

    UsersModel.find( query, projection, options, function( err, result ){
        if( err ){
            callback( err );
        } else {
            callback( null, result );
        }
    });
    console.log( 'In UsersDBI | Finished Execution of getUserListForFirstTime' );
};

/*                              Public Methods                         */
/*======================================================================*/

var getUserList = function( searchParam, pagingParams, callback ){
    console.log( 'In UsersDBI | Starting Execution of getUserList' );

    var query = {
        role : searchParam.role
    };

    if ( searchParam.role === 'restOwn' ) {
        var isAssignedNotEmpty = !DBUtils.isFieldEmpty( searchParam.isAssigned );

        if( isAssignedNotEmpty ) {
            var isAssigned = searchParam.isAssigned;

            if( isAssigned === 'true' || isAssigned ) {
                query.isAssigned = true;
            } else if( isAssigned === 'false' || !isAssigned ) {
                query.isAssigned = false;
            }
        }
    }

    console.log( query );

    var isNameNotEmpty = !DBUtils.isFieldEmpty( searchParam.name );

    if( isNameNotEmpty ) {
        query.name  = DBUtils.createCaseInsensitiveLikeString( searchParam.name );
    }

    var isEmailNotEmpty = !DBUtils.isFieldEmpty( searchParam.email );

    if( isEmailNotEmpty ) {
        query.email = DBUtils.createCaseInsensitiveLikeString( searchParam.email );
    }


    var projection = {
        credential : false,
        '_id' : false,
        "__v": false,
        role : false,
        profile_created_date : false
    };

    console.log( query );

    if(pagingParams.startIndex === 0 || null == pagingParams.startIndex || typeof pagingParams.startIndex === 'undefined' ) {
        async.parallel({
            count : async.apply( getUserCount, searchParam, query),
            result : async.apply( getUserListForFirstTime, searchParam, pagingParams, query, projection )
        },

        function( err, results ) {
            if( err ){
                callback( err );
            } else {
                callback( null, results );
            }
        });
    } else {
        console.log( pagingParams.startIndex );
        var appUsersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

        UsersModelModule.setUpConnection( appUsersDBConnection );
        var UsersModel = UsersModelModule.getUsersModel();

        var options = {
            skip : ( pagingParams.startIndex - 1),
            limit : 10,
            sort : {
                profile_created_date : 'desc'
            }
        };

        console.log( options.skip );

        UsersModel.find( query, projection, options, function( err, result ){
            if( err ){
                callback( err );
            } else {
                callback( null, {result : result });
            }
        });
    }
    console.log( 'In UsersDBI | Finished Execution of getUserList' );
};

/* Public Method to create or edit a user. */
var createOrEditUser = function( userInfo, isInsert, callback ) {
    console.log( 'In UsersDBI | Starting Execution of createOrEditUser' );

    var appUsersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );
    UsersModelModule.setUpConnection( appUsersDBConnection );

    var UsersModel = UsersModelModule.getUsersModel();

        var query = {
            email : userInfo.oldEmail
        };

        var update = {};

        var isNameNotEmpty = ! DBUtils.isFieldEmpty( userInfo.name );

        var propArray = ['name', 'email', 'contact', 'role', 'orders', 'revenueGenerated' ];
        var propArrayLength = propArray.length;

        for( var i=0; i<propArrayLength; i++ ){
            var propName = propArray[ i ];

            var isFieldNotEmpty = ! DBUtils.isFieldEmpty( userInfo[ propName ] );

            if( isFieldNotEmpty ) {
                update[ propName ] = userInfo[ propName ];
            }
        }

        console.log( query );
        console.log( update );

        UsersModel.update( query, { $set : update }, function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        });

    console.log( 'In UsersDBI | Finished Execution of createOrEditUser' );
};

/* Public Method to Reset User Password */
var resetUserPassword = function( userEmail, callback ){
    console.log( 'In UsersDBI | Starting Execution of resetUserPassword' );

    var appUsersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );
    UsersModelModule.setUpConnection( appUsersDBConnection );

    var UsersModel = UsersModelModule.getUsersModel();

    var query = { email : userEmail };
    var update = { $set : {
            credential : getSecureRandomPassword()
        }
    };

    UsersModel.update(query, update, function( err , result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    console.log( 'In UsersDBI | Finished Execution of resetUserPassword' );
};

/* Public Method to BlackList a User*/
var blackListUser = function( userEmail, blackList, callback ) {
    console.log( 'In UsersDBI | Starting Execution of blackListUser' );

    var appUsersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );
    UsersModelModule.setUpConnection( appUsersDBConnection );

    var UsersModel = UsersModelModule.getUsersModel();

    var query = { email : userEmail.trim() };
    var update = { $set : {
            isBlackListed : blackList
        }
    };

    UsersModel.update(query, update, function( err , result ) {
        if( err ) {
            callback( err );
        } else {

            if( result != 1 ){
                callback( appConstants.appErrors.someError );
            } else {
                callback( null, blackList );
            }
        }
    });

    console.log( 'In UsersDBI | Finsihed Execution of blackListUser' );
};

exports.getUserList = getUserList;
exports.createOrEditUser = createOrEditUser;
exports.resetUserPassword = resetUserPassword;
exports.blackListUser = blackListUser;