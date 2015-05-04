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

        if( reqContent.stage === 'basicDetails' ) {
            if( typeof reqContent.address === 'undefined' ){
                reqContent.address = {};
            }
            var newRestaurant = {
                stage: 'basicDetails',
                name: reqContent.name,
                slug: reqContent.slug,
                address: {
                    street: reqContent.street,
                    locality: reqContent.locality,
                    town: reqContent.town,
                    city: reqContent.city,
                    postal_code: reqContent.postal_code
                }
            };

            RestaurantService.addNewRestaurant(newRestaurant, function (err, result) {
                if (err) {
                    res.status(500)
                        .json(result);
                } else {
                    res.status(200)
                        .json(result);
                }
            });
        }
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

exports.createOrEditRestaurant = createOrEditRestaurant;
exports.getApprovedRestaurantList = getApprovedRestaurantList;
exports.getUnapprovedRestaurantList = getUnapprovedRestaurantList;