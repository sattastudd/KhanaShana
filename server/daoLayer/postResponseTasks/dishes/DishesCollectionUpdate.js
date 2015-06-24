/**
 * This Module would be responsible to update Dishes Collection so that newly added dishes are shown in the search.
 */

var DishesModelModule = require( '../../../models/dishes/Dishes' );

/** Private method to extract array to insert in the system from the menu provided. */
var getArrayToInsertFromMenu = function( menu ) {
    logger.info( 'In DishesCollectionUpdate | Starting Execution of getArrayToInsertFromMenu' );

    var arrayToPush = [];

    var restaurantMenu = menu;

    var categoriesLength = restaurantMenu.length;

    for( var i=0; i< categoriesLength; i++ ) {
        var category = restaurantMenu[ i ];

        var itemsInCategory = category.items;
        var itemsInCategoryLength = itemsInCategory.length;

        for( var j = 0; j< itemsInCategoryLength; j++ ) {

            var item = itemsInCategory[ j ] ;

            var obj = { name : item.title, active : true };
            arrayToPush.push( obj );
        }
    }

    logger.info( 'In DishesCollectionUpdate | Finished Execution of getArrayToInsertFromMenu' );

    return arrayToPush;
};


var updateDishesCollection = function( cityName, menu ) {
    logger.info( 'In DishesCollectionUpdate | Starting Execution of updateDishesCollection' );

    var arrayToPush = getArrayToInsertFromMenu( menu );

    var cityDBConnection = utils.getDBConnection( cityName );

    DishesModelModule.setUpConnection( cityDBConnection );
    var DishesModel = DishesModelModule.getModel();

    DishesModel.collection.insert( arrayToPush, { continueOnError : true }, function( err, result ) {
        if( err ) {
            logger.error( err );
        } else {
            console.log( result );
        }
    });

    logger.info( 'In DishesCollectionUpdate | Finished Execution of updateDishesCollection' );
};

exports.updateDishesCollection  = updateDishesCollection;