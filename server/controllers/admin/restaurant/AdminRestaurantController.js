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
        approved : req.body.approved,
        allStagesCompleted : req.body.allStagesCompleted
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

/*                         Restaurant Update Section Begin                   */
/*===========================================================================*/

/* Method to update restaurant details.
 * Sole purpose of this method is to retrieve values from request and put in the object,
 * to be used in serviceLayer.
 */
var updateRestaurantDetails = function( req, res, next ) {

    console.log('In AdminRestaurantController | Starting Execution of updateRestaurantDetails');

    var reqBody = {};
    var files = {
        sm : '',
        md : '',
        xs : '',
        lg : ''
    };

    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on( 'field', function( field, value ) {
        reqBody[field] = value;
    });

    form.on( 'file' , function(name, file ){
        files[ name ] = file;        
    });

    form.on( 'end', function(){

        var reqContent = JSON.parse( reqBody.model );

        var restaurant = {};

        if( reqContent.stage === 'basicDetails' ) {
            restaurant = {
                stage: 'basicDetails',
                name: reqContent.name,
                slug: reqContent.slug,

                street: reqContent.street,
                locality: reqContent.locality,
                town: reqContent.town,
                city: reqContent.city,
                postal_code: reqContent.postal_code

            };
        } else if (reqContent.stage === 'deliveryAreas') {
            restaurant = {
                stage : 'deliveryAreas',
                locations : reqContent.locations
            }
        } else if (reqContent.stage === 'cuisineArea') {
            restaurant = {
                stage : 'cuisineArea',
                cuisines : reqContent.cuisines
            }
        } else if (reqContent.stage === 'restMenu') {
            restaurant = {
                stage : 'restMenu',
                menu : reqContent.menu
            };
        } else if (reqContent.stage === 'imgUpload') {
            restaurant = {
                stage : 'imgUpload',

                imagPaths : {
                    xs : files.xs.name,
                    md : files.md.name,
                    sm : files.sm.name,
                    lg : files.lg.name
                }
            };
        }

        var slugReceivedInRequest = req.params.restSlug;

        RestaurantService.updateRestaurantDetails( slugReceivedInRequest, restaurant, function( err, result ) {
            if( err ) {
                if( err === appConstants.appErrors.validationError ) {
                    res.status( 400 )
                        .json( result );
                } else {
                    res.status( 500 )
                        .json( result );
                }
            } else {
                if (restaurant.stage === 'imgUpload') {
                    var directoryPathForRestaurant = appConstants.restaurantImagesPath + slugReceivedInRequest;

                    fs.mkdir(directoryPathForRestaurant, function (err, result) {
                        var array = ['xs', 'md', 'sm', 'lg'];
                        var arrLength = array.length;

                        for (var i = 0; i < arrLength; i++) {
                            var fileObj = files[array[i]];

                            var toRename = appConstants.restaurantImagesPath + slugReceivedInRequest + '/' + slugReceivedInRequest + '-' + array[i] + fileObj.name.substr(fileObj.name.indexOf('.'));
                            fs.rename(fileObj.path, toRename);
                        }

                    });
                }
                res.status( 200 )
                    .json( result );
            }
        });

    });

    /* Start parsing form. */
    form.parse( req );
    console.log('In AdminRestaurantController | Finished Execution of updateRestaurantDetails');

};


/*                         Restaurant Update Section End                     */
/*===========================================================================*/

/*                Restaurant Banner Image Path Retrieval Begin               */
/*===========================================================================*/

var getRestaurantBannerImagePath = function( req, res, next ) {
    console.log('In AdminRestaurantController | Starting Execution of getRestaurantBannerImagePath');

    var slugName = req.query.slug;
    var type = req.query.type;

    console.log( req.params );

    RestaurantService.getRestaurantBannerImagePath( slugName, type, function( err, result ) {
        if( err ) {
            if( err === appConstants.appErrors.validationError ) {
                res.status( 400 )
                    .json( result );
            } else {
                res.status( 500 )
                    .json( result );
            }
        } else {
            var imgPath = 'client/' + result;

            console.log( result );

            fs.readFile( imgPath, function( err, result ) {
                if( err ) {
                    console.log( err );

                    res.status( 500 )
                        .json( err );
                } else {
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    res.end(data); // Send the file data to the browser.
                }
            });
        }
    });

    console.log('In AdminRestaurantController | Starting Execution of getRestaurantBannerImagePath');
};

/*                 Restaurant Banner Image Path Retrieval End                */
/*===========================================================================*/


/*                                 Module Export                             */
/*===========================================================================*/
exports.addNewRestaurant = addNewRestaurant;
exports.searchRestaurants = searchRestaurants;
exports.updateRestaurantDetails = updateRestaurantDetails;

exports.readRestaurantSpecificData = readRestaurantSpecificData;
exports.getRestaurantBannerImagePath = getRestaurantBannerImagePath;