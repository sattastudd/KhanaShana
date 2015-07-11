/* This DBI file would handle all Customer User Account Related Tasks. 
 * Like Resetting Password, and change password.
 */

var appConstants = require( '../../../constants/ServerConstants' );
var UserModelModule = require( '../../../models/login/usersModel' );

var async = require( 'async' );

/**
 * Private method to check if password provided by user is valid.
 * This check is to be performed before user changes password.
 */
var hasUserProvidedCorrectPassword = function( userInfo, callback ) {
    logger.info( 'In CustomerAccountDBI | Starting Execution of hasUserProvidedCorrectPassword' );

    var appUsersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

    UserModelModule.setUpConnection( appUsersDBConnection );
    var UsersModel = UserModelModule.getUsersModel();

    var query = {
        email : userInfo.email,
        credential : userInfo.password
    };

    UsersModel.findOne( query, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            if( null == result ) {
                callback( appConstants.appErrors.invalidCredentials );
            } else {
                callback( null, true );
            }
        }
    });

    logger.info( 'In CustomerAccountDBI | Finished Execution of hasUserProvidedCorrectPassword' );
};

/**
 * Private method to update users' password.
 */
var updateUsersPassword = function( userInfo, hasUserProvidedCorrectPassword, callback ) {
    logger.info( 'In CustomerAccountDBI | Starting Execution of updateUsersPassword' );

    if( hasUserProvidedCorrectPassword ) {

        var appUsersDBConnection = utils.getDBConnection(appConstants.appUsersDataBase);

        UserModelModule.setUpConnection(appUsersDBConnection);
        var UsersModel = UserModelModule.getUsersModel();

        var query = {
            email: userInfo.email
        };

        var updateQuery = {
            $set: {
                credential: userInfo.newPassword
            }
        };

        UsersModel.update(query, updateQuery, function (err, count) {
            if (err) {
                callback(err);
            } else {
                if (count == 0) {
                    callback(appConstants.appErrors.someError);
                } else {
                    callback(null, count);
                }
            }
        });
    } else {
        callback( appConstants.appErrors.invalidCredentials );
    }

    logger.info( 'In CustomerAccountDBI | Finished Execution of updateUsersPassword' );
};

/**
 * Public method to update user password.
 */
var changePassword = function( userInfo, callback ) {
    logger.info( 'In CustomerAccountDBI | Starting Execution of changePassword' );

    async.waterfall([
        async.apply( hasUserProvidedCorrectPassword, userInfo ),
        async.apply( updateUsersPassword, userInfo )
    ],
        function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        })

    logger.info( 'In CustomerAccountDBI | Finished Execution of changePassword' );
};

exports.changePassword = changePassword;
