/*Controller is responsible for forwarding data to service layer.
 *And upon receiving, send the data back to client.
 */

var formidable = require( 'formidable' );
var fs = require( 'fs' );
var appConstants = require('../../../constants/ServerConstants');

var RestaurantService = require( '../../../serviceLayer/admin/restaurant/AdminRestaurantService' );

/*                      Restaurant Creation Section Begin                    */
/*===========================================================================*/

/* This is public method to perform create operation on restaurants.
 * We will insert basic details with this method.
 * All other details would be performed in update method.
 * Except, approval functionality.
 */
var addNewRestaurant = function( req, res, next ) {
    console.log('In AdminRestaurantController | Starting Execution of addNewRestaurant');

    var newRestaurant = {
        stage : 'basicDetails',
        name : req.body.name,
        slug : req.body.slug,

        street : req.body.street,
        locality : req.body.locality,
        town : req.body.town,
        city : req.body.city,

        postal_code : req.body.postal_code
    };

    RestaurantService.addNewRestaurant( newRestaurant, function( err, result ) {
        if( err ) {
            if( err === appConstants.appErrors.intentionalBreak ) {
                res.status( 409 )
                    .json( result );
            } else {
                res.status( 400 )
                    .json( result );
            }
        } else {
            res.status( 201 )
                .json( result );
        }
    });

    console.log('In AdminRestaurantController | Finished Execution of addNewRestaurant');
};

/*                      Restaurant Creation Section Begin                    */
/*===========================================================================*/

/*                         Restaurant Search Section Begin                     */
/*===========================================================================*/
var searchRestaurants = function( req, res, next ) {
    console.log('In AdminRestaurantController | Starting Execution of searchRestaurants');

    var searchParams = {
        name : req.body.name,
        locality : req.body.locality,
        approved : req.body.approved
    };

    var pagingParams = {
        startIndex : req.body.startIndex
    };

    RestaurantService.searchRestaurants( searchParams, pagingParams, function( err, result ){
        if( err ){
            if( err === appConstants.appErrors.noRecordFound ) {
                res.status( 404 )
                    .json( result );
            } else {
                res.status( 500 )
                    .json( result );
            }

        } else {
            res.status( 200 )
                .json( result );
        }
    });

    console.log('In AdminRestaurantController | Finished Execution of searchRestaurants');
};

/*                         Restaurant Search Section End                     */
/*===========================================================================*/

/*                 Restaurant Specific Data Read Section Start               */
/*===========================================================================*/
var readRestaurantSpecificData = function( req, res, next ) {
    console.log('In AdminRestaurantController | Finished Execution of readRestaurantSpecificData');

    var slug = req.body.slug;

    RestaurantService.readRestaurantSpecificData( slug, function( err, result ) {
        if( err ){
            if( err === appConstants.appErrors.noRecordFound ) {
                res.status( 404 )
                    .json( result );
            } else {
                res.status( 500 )
                    .json( result );
            }

        } else {
            res.status( 200 )
                .json( result );
        }
    });
    console.log('In AdminRestaurantController | Finished Execution of readRestaurantSpecificData');
};

/*                 Restaurant Specific Data Read Section End               */
/*===========================================================================*/

/*                                 Module Export                             */
/*===========================================================================*/
exports.addNewRestaurant = addNewRestaurant;
exports.searchRestaurants = searchRestaurants;

exports.readRestaurantSpecificData = readRestaurantSpecificData;