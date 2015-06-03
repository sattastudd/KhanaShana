var RestaurantPublicController = require( '../controllers/public/RestaurantPublicController' );

/* Request-Name : /public/restaurant, Type : Get, Allowed : public*/
router.get('/public/restaurant/:restaurantSlug', function( req, res, next ){

    req.body.cityName = 'lucknow';
    req.body.restaurantSlug = req.params.restaurantSlug;

    RestaurantPublicController.getRestaurantInfoBySlug(req, res, next);
});

/* Request-Name : /public/restaurant/search, Type : Post, Allowed : public */
router.post( '/public/restaurant/search', function( req, res, next ) {

    RestaurantPublicController.searchRestaurants( req, res, next );
})

/* Request-Name : /public/restaurant/typeahead, Type : Post, Allowed : public */
router.post( '/public/restaurant/typeahead', function( req, res, next ){
    RestaurantPublicController.getOptionsForTypeAhead( req, res, next );
});