/* This is DB Interaction file for Admin Cuisine related tasks. */

var CuisineModelModule = require( '../../../models/cuisines/cuisinesModel' );
var DbUtils = require( '../../util/DBIUtil' );
var AppConstants = require( '../../../constants/ServerConstants' );

var async = require( 'async' );

/*                      Cuisine Search Section Begin                    */
/*===========================================================================*/

/*              Private Methods             */
/*==========================================*/

/**
 * Private method to get total cuisines count.
 * It takes search parameters into account.
 * It would only be executed if user has initiated a fresh search.
 */
var getCuisineCount = function( searchParam, cityName, query, callback ) {
    logger.info( 'In AdminCuisineDBI | Starting Execution of getCuisinesCount' );

    var cityDBConnection = utils.getDBConnection( cityName );

    CuisineModelModule.setUpConnection( cityDBConnection );
    var CuisineModel = CuisineModelModule.getModel();

    CuisineModel.count( query, function( err, count ) {
        if( err ) {
            callback ( err );
        } else {
            callback ( null, count );
        }
    });

    logger.info( 'In AdminCuisineDBI | Finished Execution of getCuisinesCount' );
};

/**
 * Private method to search on first retrieval of data.
 * This method is only called in case of fresh search.
 */
var getCuisinesForFirstTime = function( searchParam, cityName, query, projection, callback ) {
    logger.info( 'In AdminCuisineDBI | Starting Execution of getCuisinesForFirstTime' );

    var cityDBConnection = utils.getDBConnection( cityName );

    CuisineModelModule.setUpConnection( cityDBConnection );
    var CuisineModel = CuisineModelModule.getModel();

    var option = {
        limit : 10
    };

    CuisineModel.find( query, projection, option, function( err, result ) {
        if( err ) {
            callback ( err );
        } else {
            callback ( null, result );
        }
    });

    logger.info( 'In AdminCuisineDBI | Finished Execution of getCuisinesForFirstTime' );
};

/*                              Public Methods                         */
/*======================================================================*/
var getCuisines = function( cityName, searchParam, pagingParams, callback ) {
    logger.info( 'In AdminCuisineDBI | Starting Execution of getCuisines' );

    var query = {};
    var projection = {
        "_id" : false,
        "img" : false
    };

    var isNameNotEmpty = !DbUtils.isFieldEmpty( searchParam.name );

    if( isNameNotEmpty ) {
        query.name = DbUtils.createCaseInsensitiveLikeString( searchParam.name )
    };

    console.log( query );

    if(pagingParams.startIndex === 0 || null == pagingParams.startIndex || typeof pagingParams.startIndex === 'undefined' ) {

        async.parallel({
            count : async.apply(getCuisineCount, searchParam, cityName, query ),
            result : async.apply(getCuisinesForFirstTime, searchParam, cityName, query, projection)
        },

            function( err, result ) {
                if( err ) {
                    callback( err );
                } else {
                    callback( null, result );
                }
            }
        )
    } else {
        var options = {
            skip : ( pagingParams.startIndex - 1),
            limit : 10
        };

        var cityDBConnection = utils.getDBConnection( cityName );

        CuisineModelModule.setUpConnection( cityDBConnection );
        var CuisineModel = CuisineModelModule.getModel();

        CuisineModel.find( query, projection, options, function( err, result ){
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        });
    }

    logger.info( 'In AdminCuisineDBI | Finished Execution of getCuisines' );
};

exports.getCuisines = getCuisines;