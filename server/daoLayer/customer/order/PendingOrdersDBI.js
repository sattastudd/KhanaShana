var mongoose = require( 'mongoose' );
var async = require( 'async' );

var RestaurantModelModule = require( '../../../models/restaurant/restaurants' );
var OrdersModelModule = require( '../../../models/orders/OrdersModel' );
var ServerConstants = require( '../../../constants/ServerConstants' );

/**
 * Private method to compute total price from the DB.
 * It is done to avoid manipulation at the client side.
 * @param cityName : name of city ( database ).
 * @param restSlug : restaurant slug ( string ).
 * @param orderedDishes : array of ordered dishes.
 * @param callback
 */
var getTotalCountForOrder = function( cityName, restaurant, orderedDishes, callback ) {

    logger.info( 'In PendingOrdersDBI | Starting Execution of getTotalCountForOrder' );

    var cityDBConnection = utils.getDBConnection(cityName);

    RestaurantModelModule.setUpConnection(cityDBConnection);
    var RestaurantModel = RestaurantModelModule.getModel();

    var query = [
        {
            '$match' : {
                'slug' : restaurant.slug
            }
        },

        {
            '$unwind' : '$menu'
        },

        {
            '$unwind' : '$menu.items'
        },

        {
            '$match' : {
                'menu.items.title' : {
                    '$in' : [

                    ]
                }
            }
        },

        { '$sort' : { '_id' : 1 }},

        { '$group' : {
            '_id' : '$_id',
            name : { '$first' : '$name'},
            menu : { '$push' : '$menu'}
        }}
    ];

    var orderedDishesLength = orderedDishes.length;

    for( var i=0; i< orderedDishesLength; i++ ) {
        query[3]['$match']['menu.items.title']['$in'].push( orderedDishes[i].dish);
    }

    RestaurantModel.aggregate( query, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            var totalCost = 0;

            var restaurantSearched = result[0];
            var searchedMenu = restaurantSearched.menu;
            var searchedItemsLength = searchedMenu.length;

            for( var i=0; i< orderedDishesLength; i++ ) {
                var dishName = orderedDishes[i].dish;
                var categoryName = orderedDishes[i].category;
                var quantity = orderedDishes[i].quantity;
                var dishType = orderedDishes[i].value;

                for( var j=0; j<searchedItemsLength; j++ ) {
                    var categoryItem = searchedMenu[j];

                    if( categoryItem.title === categoryName && categoryItem.items.title === dishName ) {

                        totalCost = totalCost + ( categoryItem.items.price[ dishType.toLowerCase() ] * quantity );
                        break;
                    }
                }
            }

            callback( null, totalCost );
        }
    });

    logger.info( 'In PendingOrdersDBI | Finished Execution of getTotalCountForOrder' );

};

/**
 * Private method to put this order into pending orders list.
 * @param cityName : name of city ( database ).
 * @param userInfo : information of the user placing the order.
 * @param restaurantInfo : information of restaurant responsible for the order.
 * @param orderedDishes : array of ordered dished.
 * @param totalPrice : total price computed from previous function.
 * @param callback
 */
var addOrderIntoOrders = function( cityName, userInfo, restaurantInfo, orderedDishes, totalPrice, callback ) {
    logger.info( 'In PendingOrdersDBI | Starting Execution of addOrderIntoOrders' );

    var cityDBConnection = utils.getDBConnection(cityName);
    OrdersModelModule.setUpConnection( cityDBConnection );

    var OrderModel = OrdersModelModule.getModel();

    var dishes = [];
    var orderedDishesLength = orderedDishes.length;

    for( var i=0; i<orderedDishesLength; i++ ) {
        var dishAtIndex = orderedDishes[i];

        var objectToPush = {
            title : dishAtIndex.dish,
            quantity : dishAtIndex.quantity,
            price : dishAtIndex.price,
            total : ( dishAtIndex.price * dishAtIndex.quantity ),
            type : dishAtIndex.value
        };

        dishes.push( objectToPush );
    }

    var newOrder = {
        restaurant : {
            name : restaurantInfo.name,
            slug : restaurantInfo.slug
        },
        user : {
            email : userInfo
        },
        items : dishes,
        status : 'pending',
        total : totalPrice,
        pending_state_date : new Date()
    };

    var Order = new OrderModel( newOrder );

    Order.save(function(err, result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    logger.info( 'In PendingOrdersDBI | Finished Execution of addOrderIntoOrders' );
};

/**
 * Public method to add order into pending orders list.
 * @param cityName : string, name of city ( database ).
 * @param userInfo : string, information of the user placing the order.
 * @param restaurantInfo : string, information of restaurant responsible for the order.
 * @param orderedDishes : array of ordered dished.
 * @param callback
 */
var addOrderIntoPendingOrdersList = function( cityName, userInfo, restaurantInfo, orderedDishes, callback ) {
    logger.info( 'In PendingOrdersDBI | Starting Execution of addOrderIntoPendingOrdersList' );
    async.waterfall([
        async.apply( getTotalCountForOrder, cityName, restaurantInfo, orderedDishes ),
        async.apply( addOrderIntoOrders, cityName, userInfo, restaurantInfo, orderedDishes )
    ], function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    logger.info( 'In PendingOrdersDBI | Finished Execution of addOrderIntoPendingOrdersList' );
};

exports.addOrderIntoPendingOrdersList = addOrderIntoPendingOrdersList;