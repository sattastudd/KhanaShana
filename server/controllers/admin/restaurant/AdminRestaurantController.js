/*Controller is responsible for forwarding data to service layer.
 *And upon receiving, send the data back to client.
 */

var formidable = require( 'formidable' );
var fs = require( 'fs' );

var RestaurantService = require( '../../../serviceLayer/admin/restaurant/AdminRestaurantService' );

var createOrEditRestaurant = function( req, res, next ){

    var reqBody = {};
    var files = [];

    console.log('In AdminRestaurantController | Starting Execution of createOrEditRestaurant' );
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on( 'field', function( field, value ) {
        reqBody[field] = value;
    });

    form.on( 'file' , function(name, file ){




        fs.rename( file.path, file.name, function( err ){

            files.push( file );


        });
    });

    form.on( 'end', function(){
        console.log( reqBody );

        var reqContent = JSON.parse( reqBody.model );

        var newRestaurant = {};

        if( reqContent.stage === 'basicDetails' ) {
            if( typeof reqContent.address === 'undefined' ){
                reqContent.address = {};
            }
            newRestaurant = {
                stage: 'basicDetails',
                name: reqContent.name,
                slug: reqContent.slug,
                
                street: reqContent.street,
                locality: reqContent.locality,
                town: reqContent.town,
                city: reqContent.city,
                postal_code: reqContent.postal_code
                
            };
        } else if( reqContent.stage === 'deliveryAreas' ) {
            newRestaurant = {
                stage: 'deliveryAreas',
                slug : reqContent.slug,
                locations : reqContent.deliveryAreas
            };
        } else if( reqContent.stage === 'cuisineArea' ) {
            newRestaurant = {
                stage: 'deliveryAreas',
                slug : reqContent.slug,
                cuisines : reqContent.cuisines
            };
        } else if( reqContent.stage === 'restMenu' ) {
            newRestaurant = {
                stage: 'deliveryAreas',
                slug : reqContent.slug,
                cuisines : reqContent.cuisines
            };
        } else if( reqContent.stage === 'imgUpload' ) {
            newRestaurant = {
                stage: 'imgUpload',
                slug : reqContent.slug,
                cuisines : reqContent.image
            };
        }

        RestaurantService.addNewRestaurant(newRestaurant, function (err, result) {
            if (err) {
                res.status(500)
                    .json(result);
            } else {
                res.status(200)
                    .json(result);
            }
        });
    });

    form.parse( req );

    console.log( 'In AdminRestaurantController | Finished Execution of createOrEditRestaurant' );
};

/* Public Method to getOrSearch Restaurants */
var getApprovedRestaurantList = function( req, res, next ){
    console.log( 'In AdminRestaurantController | Starting Execution of getApprovedRestaurantList' );

    var searchParams = {
        name : req.body.name,
        locality : req.body.locality
    };

    var pagingParams = {
        startIndex : req.body.startIndex
    };

    RestaurantService.getApprovedRestaurantList( searchParams, pagingParams, function( err, result ){
        if( err ){
            res.status( 500 )
                .json( result );
        } else {
            res.status( 200 )
                .json( result );
        }
    });

    console.log( 'In AdminRestaurantController | Finished Execution of getApprovedRestaurantList' );
};

/* Get Unapproved RestaurantList */
var getUnapprovedRestaurantList = function( req, res, next ) {
    console.log( 'In AdminRestaurantController | Starting Execution of getUnapprovedRestaurantList' );

    var searchParams = {
        name : req.body.name,
        locality : req.body.locality
    };

    var pagingParams = {
        startIndex : req.body.startIndex
    };

    RestaurantService.getUnapprovedRestaurantList( searchParams, pagingParams, function( err, result ){
        if( err ){
            res.status( 500 )
                .json( result );
        } else {
            res.status( 200 )
                .json( result );
        }
    });

    console.log( 'In AdminRestaurantController | Finished Execution of getUnapprovedRestaurantList' );
};

/* This method would be used to fetch the data of the restaurant using its slug. */
var getRestaurantInfoBySlug = function( req, res, next ) {
    console.log( 'In AdminRestaurantController | Starting Execution of getRestaurantInfoBySlug' );

    var slug = req.params.slug;
    console.log( slug );

    res.status( 200 )
        .json( {} );


    console.log( 'In AdminRestaurantController | Finished Execution of getRestaurantInfoBySlug' );
};

exports.createOrEditRestaurant = createOrEditRestaurant;
exports.getRestaurantInfoBySlug = getRestaurantInfoBySlug;

exports.getApprovedRestaurantList = getApprovedRestaurantList;
exports.getUnapprovedRestaurantList = getUnapprovedRestaurantList;