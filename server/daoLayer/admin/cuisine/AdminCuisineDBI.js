/* This is a Database Interaction file Responsible for adding, editing, deleting a cuisines.
 */

var CuisinesModelModule = require( '../../../models/cuisines/cuisinesModel' );

/* This public method is used to add a new cuisine into system.
 */
var addNewCuisine = function( cityName, cuisine, callback ){
    console.log( 'In AdminCuisineDBI | Starting Execution of addNewCuisines' );

    var cityDBConnection = utils.getDBConnection( cityName );

    CuisinesModelModule.setUpConnection( cityDBConnection );
    var CuisinesModel = CuisinesModelModule.getCuisinesModel();

    var Cuisine = new CuisinesModel({
        name : cuisine.name,
        img : null,
        showOnHomePage : false
    });

    Cuisine.save( function( err, result ){
        if( err ){
            callback( err );
        } else {
            callback( null, result );
        }
    });

    console.log( 'In AdminCuisineDBI | Finished Execution of addNewCuisines' );
};

/* This public method would be used to update cuisine */
var editCuisineBySlug = function( cityName, slug, cuisine, callback ){
    console.log( 'In AdminCuisineDBI | Starting Execution of editCuisine' );

    var cityDBConnection = utils.getDBConnection( cityName );

    CuisinesModelModule.setUpConnection( cityDBConnection );
    var CuisinesModel = CuisinesModelModule.getCuisinesModel();

    var query = {
        slug : slug
    };

    var update = {
        $set : {
            name : cuisine.name,
            img : cuisine.img,
            showOnHomePage : cuisine.showOnHomePage
        }
    };

    CuisinesModel.update( query, update, function ( err, numberOfRowsEffected ){
        if( err ) {
            callback( err );
        } else {
            callback( null, numberOfRowsEffected );
        }
    });
    console.log( 'In AdminCuisineDBI | Finished Execution of editCuisine' );
};

/* This public method would be used to delete a cuisines from the DB.
 */
var deleteCuisineBySlug = function( cityName, cuisineSlug, callback ) {
    console.log( 'In AdminCuisineDBI | Starting Execution of deleteCuisineBySlug' );

    var cityDBConnection = utils.getDBConnection( cityName );

    CuisinesModelModule.setUpConnection( cityDBConnection );
    var CuisinesModel = CuisinesModelModule.getCuisinesModel();

    var query = {
        slug : cuisineSlug
    };

    CuisinesModel.findOneAndRemove( query, function ( err, result ){
        if( err ) {
            callback( err );
        }
        else {
            callback( null, result );
        }
    });

    console.log( 'In AdminCuisineDBI | Finished Execution of deleteCuisineBySlug' );
};

/* This public method would check if a cuisine is already present */
var isCuisineNotPresent = function ( cityName, cuisineName, callback ) {

    console.log( 'In AdminCuisineDBI | Starting Execution of isCuisineNotPresent' );

    var cityDBConnection = utils.getDBConnection( cityName );

    CuisinesModelModule.setUpConnection( cityDBConnection );
    var CuisinesModel = CuisinesModelModule.getCuisinesModel();

    var query = {
        name : cuisineName
    };

    CuisinesModel.findOne( query, function ( err, result ) {
        if( err ) {
            callback ( err );
        } else {
            if( null !== result ){
                callback( null, true );
            } else {
                callback( null, false );
            }
        }
    });

    console.log( 'In AdminCuisineDBI | Finished Execution of isCuisineNotPresent' );

};

/* This public method would check if a cuisine is already present */
var isSlugNameNotPresent = function ( cityName, cuisineSlug, callback ) {

    console.log( 'In AdminCuisineDBI | Starting Execution of isSlugNameNotPresent' );

    var cityDBConnection = utils.getDBConnection( cityName );

    CuisinesModelModule.setUpConnection( cityDBConnection );
    var CuisinesModel = CuisinesModelModule.getCuisinesModel();

    var query = {
        slug : cuisineSlug
    };

    CuisinesModel.findOne( query, function ( err, result ) {
        if( err ) {
            callback ( err );
        } else {
            if( null !== result ){
                callback( null, true );
            } else {
                callback( null, false );
            }
        }
    });

    console.log( 'In AdminCuisineDBI | Finished Execution of isSlugNameNotPresent' );

};

/*
    console.log( 'In AdminCuisineDBI | Starting Execution of methodName' );
    console.log( 'In AdminCuisineDBI | Finished Execution of methodName' );
 */

exports.addNewCuisine = addNewCuisine;
exports.editCuisineBySlug = editCuisineBySlug;
exports.deleteCuisineBySlug = deleteCuisineBySlug;
exports.isCuisineNotPresent = isCuisineNotPresent;
exports.isSlugNameNotPresent = isSlugNameNotPresent;
