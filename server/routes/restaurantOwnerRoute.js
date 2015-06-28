var adminRestController = require( '../controllers/admin/restaurant/AdminRestaurantController' );
var optionsController = require( '../controllers/admin/options/OptionsController' );

/* Request-Name : /restOwn/restaurant/:restSlug, Type : Get, Allowed : restOwn*/
/* This request would be used by restOwn to retrieve all data of restaurant.*/
router.get( '/restOwn/restaurant/:restSlug', function( req, res, next ) {
    logger.info( 'In restaurantOwnerRoute | Handling ' + req.route.path );

    req.body.slug = req.params.restSlug;
    adminRestController.readRestaurantSpecificData(req, res, next );

    logger.info( 'In restaurantOwnerRoute | Finished ' + req.route.path );
});

/* Request-Name : /restOwn/options, Type : Get, Allowed : restOwn*/
/* This request would be used by restOwn to get application options. */

router.get( '/restOwn/options', function( req, res, next ){
    logger.info( 'In restaurantOwnerRoute | Handling ' + req.route.path );

    optionsController.getRestaurantOptions( req, res, next );

    logger.info( 'In restaurantOwnerRoute | Finished ' + req.route.path );
});

/* Request-Name : /restOwn/restaurant/:restSlug, Type : Put, Allowed : restOwn*/
/* This request would be used by restOwn to update existing restaurant details. */
router.put( '/restOwn/restaurant/:restSlug', function( req, res, next ) {

    logger.info( 'In restaurantOwnerRoute | Handling ' + req.route.path );

    adminRestController.updateRestaurantDetails(req, res, next );

    logger.info( 'In restaurantOwnerRoute | Finished ' + req.route.path );

});