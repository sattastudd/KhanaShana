/* This DBI file would handle all users related functionality.
 */

var appConstants = require( '../../../constants/ServerConstants' );
var UsersModelModule = require( '../../../models/login/usersModel' );

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

    var options = {};

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
        role : 'user'
    };

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
        role : false
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
            limit : 10
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

    if( isInsert ) {
        var User = new UsersModel({
            name : userInfo.name,
            email : userInfo.email.toLowerCase(),
            credential : userInfo.credential,
            contact : userInfo.contact,
            role : userInfo.role,
            profile_created_date : (new Date()).getTime(),
            orders : 0,
            revenueGenerated : 0
        });

        User.save( function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, stripObjectProperties( result) );
            }
        });
    } else {
        var query = {
            email : userInfo.email
        };

        var update = {};

        var isNameNotEmpty = ! DBUtils.isFieldEmpty( userInfo.name );

        var propArray = ['name', 'contact', 'role', 'orders', 'revenueGenerated' ];
        var propArrayLength = propArray.length;

        for( var i=0; i<propArrayLength; i++ ){
            var propName = propArray[ i ];

            var isFieldNotEmpty = ! DBUtils.isFieldEmpty( userInfo[ propName ] );

            if( isFieldNotEmpty ) {
                update[ propName ] = userInfo[ propName ];
            }
        }

        UsersModel.update( query, { $set : update }, function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        });
    }
    console.log( 'In UsersDBI | Finished Execution of createOrEditUser' );
};

exports.getUserList = getUserList;
exports.createOrEditUser = createOrEditUser;