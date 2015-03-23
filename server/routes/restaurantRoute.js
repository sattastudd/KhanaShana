var RestaurantPublicController = require( '../controllers/public/RestaurantPublicController' );

/* Request-Name : /public/restaurant, Type : Get, Allowed : public*/
router.get('/public/restaurant/:restaurantSlug', function( req, res, next ){
    console.log( req.params.restaurantSlug);
    req.body.cityName = 'lucknow';
    req.body.restaurantSlug = req.params.restaurantSlug;

    RestaurantPublicController.getRestaurantInfoBySlug(req, res, next);
});
