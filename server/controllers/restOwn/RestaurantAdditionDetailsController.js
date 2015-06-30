var formidable = require( 'formidable' );
var fs = require( 'fs' );
var mv = require( 'mv' );

var ServerConstants = require( '../../constants/ServerConstants' );
var RestaurantAdditionDetailsService = require( '../../serviceLayer/restOwn/RestaurantAdditionalDetailsService' );

var updateRestaurantDetails = function( req, res, next ) {
    logger.info( 'In RestaurantAdditionalDetailsController | Starting Execution of updateRestaurantDetails ' );

    var reqBody = {};
    var files = {
        snip : ''
    };

    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on( 'field', function( field, value ) {
        reqBody[field] = value;
    });

    form.on( 'file' , function(name, file ){
        files[ name ] = file;
    });

    form.on( 'end', function() {

        var reqContent = JSON.parse(reqBody.model);

        reqContent.snip = files.snip.name;
        reqContent.slug = req.user.assignedRestaurantSlug;

        RestaurantAdditionDetailsService.updateRestaurantInfo( reqContent, function( err, result ) {
            if( err ) {
                if( err === ServerConstants.appErrors.validationError ) {
                    res.status( 400).json( result );
                } else {
                    res.status( 500).json( result );
                }
            } else {

                var directoryPathForRestaurant = ServerConstants.restaurantImagesPath + reqContent.slug;

                fs.mkdir(directoryPathForRestaurant, function (err, result) {
                    if( typeof files.snip !== 'undefined' && typeof files.snip !== 'String' ) {
                        var toRename = ServerConstants.restaurantImagesPath + reqContent.slug + '/' + reqContent.slug + '-snip' + files.snip.name.substr(files.snip.name.indexOf('.'));

                        mv(files.snip.path, toRename, function( err, result ) {
                            console.log( err );
                            console.log( result );
                        });
                    }
                });

                res.status( 200).json( result );

            }
        });
    });


    form.parse( req );

    logger.info( 'In RestaurantAdditionalDetailsController | Finished Execution of updateRestaurantDetails ' );
};

/** Public Method to read Additional Restaurant Data */
var readRestaurantAdditionalData = function( req, res, next ) {
    logger.info( 'In RestaurantAdditionalDetailsController | Starting Execution of readRestaurantAdditionalData ' );

    var restSlug = req.user.assignedRestaurantSlug;

    RestaurantAdditionDetailsService.readRestaurantAdditionalData( restSlug, function( err, result ) {
        if( err ) {
            res.status( 500).json( result );
        } else {
            res.status( 200).json( result );
        }
    });

    logger.info( 'In RestaurantAdditionalDetailsController | Finished Execution of readRestaurantAdditionalData ' );
};

exports.updateRestaurantDetails = updateRestaurantDetails;
exports.readRestaurantAdditionalData = readRestaurantAdditionalData;