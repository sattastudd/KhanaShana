/*In here, we will handle Users Related Information
 */

var appConstants = require( '../../../constants/ServerConstants' );
var RestaurantDBI = require( '../../../daoLayer/admin/restaurant/AdminRestaurantDBI' );

var Validator = require( '../../util/Validator' );

var setUpError = function (err, errMsg, type, response) {

    if( type.split( '.' ).length > 1) {

        var splitArray = type.split('.');
        var splitArrayLength = splitArray.length;

        if( splitArrayLength === 2 ){
            var firstPart = splitArray[0];
            var secondPart = splitArray[1];

            if( typeof err[ firstPart ] === 'undefined' ) {
                err[ firstPart ]  = {};
            }

            var tempOne = err[ firstPart ];
            tempOne[ secondPart ] = response.result;

            if( typeof errMsg[ firstPart ] === 'undefined' ) {
                errMsg[ firstPart ] = {};
            }

            var tempTwo = errMsg[ firstPart ];
            tempTwo[ secondPart ] = response.message;;

        }


    } else {
        err[type] = response.result;
        errMsg[type] = response.message;
    }
};

/* Private method to return appropriate success method depending upon stage of restaurant. */
var getSuccessMessage = function( stage ) {
    if( stage === 'basicDetails' ) {
        return appConstants.basicDetailsAdded
    }
};

/* This is public utility method to search and retrieve approved restaurant list from application.*/
var getApprovedRestaurantList = function( searchParams, pagingParams, callback ){
    console.log( 'In AdminRestaurantService | Starting Execution of getApprovedRestaurantList' );

    /*Starting Validation here.*/
    var name = searchParams.name;
    var locality = searchParams.locality;

    searchParams.cityName = 'lucknow';

    var hasAnyValidationFailed = false;
    var responseMessage  = '';

    var isNameBlank = Validator.isFieldEmpty( name );
    var islocalityBlank = Validator.isFieldEmpty( locality );

    if( isNameBlank ){
        delete searchParams.name;
    } else {

        var resultForName = Validator.isNameNotValid( name );

        if( resultForName.result ){
            hasAnyValidationFailed = true;
            responseMessage = resultForName.message;
        }
    }

    if( islocalityBlank ) {
        delete  searchParams.locality;
    } else {
        var resultForLocality = Validator.isEmailNotValid( locality );

        if( resultForLocality.result ) {
            hasAnyValidationFailed = true;
            responseMessage = resultForLocality.message;
        }
    }

    if( hasAnyValidationFailed ) {
        callback( appConstants.appErrors.validationError, {
            err : true,
            errMsg : responseMessage,
            data : null,
            msg : responseMessage
        });

        return;
    }

    if( !pagingParams.startIndex ){
        pagingParams.startIndex = 0;
    }

    /* Since, we will use getRestaurantList to get approved and unapproved restaurantList,
     * so, this is the best place to modify the query to do so.
     */

    var query = {
        approved : true,
        owner : /[a-zA-Z]{1,}/
    };

    RestaurantDBI.getRestaurantList( searchParams, pagingParams, query, function(err, result ){
        if( err ){
            console.log( 'In AdminRestaurantService ' + err );

            callback( appConstants.appErrors.someError, {
                err : {},
                errMsg : {},
                data : null,
                msg : appConstants.errorMessage.someError
            });
        } else {
            if( null == result || result.result.length === 0 ){
                callback( appConstants.appErrors.noRecordFound, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : appConstants.errorMessage.noRecordFound
                });
            } else {
                callback( null, {
                    err : {},
                    errMsg : {},
                    data : result,
                    msg : appConstants.successMessage
                });
            }
        }
    });

    console.log( 'In AdminRestaurantService | Finished Execution of getApprovedRestaurantList' );
};

/* This method would be used to retrieve unapproved restaurant list. */
var getUnapprovedRestaurantList = function( searchParams, pagingParams, callback ){
    console.log( 'In AdminRestaurantService | Starting Execution of getUnapprovedRestaurantList' );

    /*Starting Validation here.*/
    var name = searchParams.name;
    var locality = searchParams.locality;

    searchParams.cityName = 'lucknow';

    var hasAnyValidationFailed = false;
    var responseMessage  = '';

    var isNameBlank = Validator.isFieldEmpty( name );
    var islocalityBlank = Validator.isFieldEmpty( locality );

    if( isNameBlank ){
        delete searchParams.name;
    } else {

        var resultForName = Validator.isNameNotValid( name );

        if( resultForName.result ){
            hasAnyValidationFailed = true;
            responseMessage = resultForName.message;
        }
    }

    if( islocalityBlank ) {
        delete  searchParams.locality;
    } else {
        var resultForLocality = Validator.isEmailNotValid( locality );

        if( resultForLocality.result ) {
            hasAnyValidationFailed = true;
            responseMessage = resultForLocality.message;
        }
    }

    if( hasAnyValidationFailed ) {
        callback( appConstants.appErrors.validationError, {
            err : true,
            errMsg : responseMessage,
            data : null,
            msg : responseMessage
        });

        return;
    }

    if( !pagingParams.startIndex ){
        pagingParams.startIndex = 0;
    }

    /* Since, we will use getRestaurantList to get approved and unapproved restaurantList,
     * so, this is the best place to modify the query to do so.
     */

    var query = {
        approved : false,
        owner : ''
    };

    RestaurantDBI.getRestaurantList( searchParams, pagingParams, query, function(err, result ){
        if( err ){
            console.log( 'In AdminRestaurantService ' + err );

            callback( appConstants.appErrors.someError, {
                err : {},
                errMsg : {},
                data : null,
                msg : appConstants.errorMessage.someError
            });
        } else {
            if( null == result || result.result.length === 0 ){
                callback( appConstants.appErrors.noRecordFound, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : appConstants.errorMessage.noRecordFound
                });
            } else {
                callback( null, {
                    err : {},
                    errMsg : {},
                    data : result,
                    msg : appConstants.successMessage
                });
            }
        }
    });

    console.log( 'In AdminRestaurantService | Finished Execution of getUnapprovedRestaurantList' );
};

/* This method would be used to create new restaurants.*/
var addNewRestaurant = function( newRestaurant, callback ){
    console.log( 'In AdminRestaurantService | Starting Execution of addNewRestaurant' );

    var hasAnyValidationFailed = false;

    var err = {};
    var errMsg = {};

    if( newRestaurant.stage === 'basicDetails' ){
        var propArray = ['name', 'name | slug', 'name | street', 'name | locality', 'name | town', 'name | city', 'number | postal_code'];
        var propArrLen = propArray.length;

        for( var i=0; i<propArrLen; i++){
            var propName = propArray[ i ] ;

            var canBeSplit = propName.split( '| ' ).length > 1;
            var type, propertyStoredIn, propValue='';

            if( canBeSplit ) {
                type = propName.split( '|' )[0].trim();
                propertyStoredIn = propName.split( '|' )[1].trim();

                
                propValue = newRestaurant[ propertyStoredIn ];
                
            } else {
                type = propName;
                propertyStoredIn = propName;

                propValue = newRestaurant[propertyStoredIn];
            }

            var responseFromValidatorForField = Validator.isFieldNotValidByType(propValue, true, type );

            if( responseFromValidatorForField.result ) {
                hasAnyValidationFailed = true;

                setUpError( err, errMsg, propertyStoredIn, responseFromValidatorForField );
            }
        }

        if( !hasAnyValidationFailed ) {
            newRestaurant.address = {
                street : newRestaurant.street,
                town : newRestaurant.town,
                city : newRestaurant.city,
                postal_code : newRestaurant.postal_code
            }
        }
    } else if( newRestaurant.stage === 'deliveryAreas' ) {
        var locationsArray = newRestaurant.locations;
        var locationsArrLength = locationArray.length;

        if( locationsArrLength === 0 ) {
            err.locations = true;
            errMsg.locations = appConstants.errorMessage.noDeliveryArea

            callback( appConstants.appErrors.validationError, {
                err : err,
                errMsg : errMsg,
                data : null,
                msg : appConstants.appErrors.removeError
            } );

            return;
        }

        var isAnyLocationInvalid = false;

        for( var i=0; i<locationsArrLength; i++) {

            var locationName = locationsArray[ i ];

            var responseFromValidatorForLocNmae = Validator.isNameNotValid( locationName, true );

            if( responseFromValidatorForLocNmae.result ) {
                isAnyLocationInvalid = true;
                break;
            }
        }

        if( isAnyLocationInvalid ) {

            err.locations = true;
            errMsg.locations = appConstants.errorMessage.deliveryAreaInvalid

            callback( appConstants.appErrors.validationError, {
                err : err,
                errMsg : errMsg,
                data : null,
                msg : appConstants.appErrors.removeError
            } );

            return
        }
    } else if( stage === 'cuisineArea' ){
        var cuisineArray = newRestaurant.cuisines;
        var cuisineArrLength = cuisineArray.length;

        if( cuisineArrLength === 0 ) {
            err.cuisines = true;
            errMsg.cuisines = appConstants.errorMessage.noCuisineSelected

            callback( appConstants.appErrors.validationError, {
                err : err,
                errMsg : errMsg,
                data : null,
                msg : appConstants.appErrors.removeError
            } );

            return;
        }

        var isAnyCuisineInvalid = false;

        for( var i=0; i<cuisineArrLength; i++) {

            var cuisineName = cuisineArray[ i ];

            var responseFromValidatorForCuisineName = Validator.isNameNotValid( cuisineName, true );

            if( responseFromValidatorForCuisineName.result ) {
                isAnyCuisineInvalid = true;
                break;
            }
        }

        if( isAnyCuisineInvalid ) {

            err.cuisines = true;
            errMsg.cuisines = appConstants.errorMessage.cuisineNameInvalid

            callback( appConstants.appErrors.validationError, {
                err : err,
                errMsg : errMsg,
                data : null,
                msg : appConstants.appErrors.removeError
            } );

            return
        }
    } else if( stage === 'restMenu' ) {
        var restMenu = newRestaurant.menu;

        if( !Array.isArray( restMenu) || restMenu.length === 0 ){

            callback( appConstants.appErrors.validationError, {
                err : {},
                errMsg : {},
                data : null,
                msg : appConstants.appError.noMenuPresent
            } );
            return;
        } else {
            var restMenuLength = restMenu.length;

            err.menu = [];
            errMsg.menu = [];

            hasAnyValidationFailed = false;

            for( var i=0; i<restMenuLength; i++) {
                var category = restMenu[ i ];

                var categoryError = {};
                var categoryErrorMsg = {};

                /* Category Title Validation */
                var categoryTitle = category.title;

                var responseFromValidatorForCatTitle = Validator.isNameNotValid( categoryTitle, true );

                if( responseFromValidatorForCatTitle.result ) {

                    hasAnyValidationFailed = true;

                    categoryError.title = true;
                    categoryErrorMsg.title = responseFromValidatorForCatTitle.message;
                }

                /* Cateogry Items Validation */
                var items = category.items;

                categoryError.items = [];
                categoryErrorMsg.items = [];

                if( !Array.isArray( items ) || items.length === 0 ) {
                    categoryError.items = true;
                    categoryErrorMsg.items = appConstants.appErrors.noItemInCategory;
                } else {

                    var itemsLength = items.length;

                    for( var j=0; j<itemsLength; j++) {
                        var itemAt = items[ j ];

                        var itemErr = {
                            price : {}
                        };

                        var itemErrMsg = {
                            price : {}
                        };

                        var itemTitle = itemAt.title;
                        var itemType = item.type;

                        var itemPriceHalf = item.price.half;
                        var itemPriceFull = item.price.full;

                        var responseFromValidatorForTitle = Validator.isNameNotValid( itemTitle, true);
                        var responseFromValidatorForType = Validator.isNameNotValid( itemType, true);

                        var responseFromValidatorForHalfPrice = Validator.isNumberNotValid( itemPriceHelf, true );
                        var responseFromValidatorForFullPrice = Validator.isNumberNotValid( itemPriceFull, true);

                        if( responseFromValidatorForTitle.result ) {
                            hasAnyValidationFailed = true;

                            itemErr.title = true;
                            itemErrMsg.title = responseFromValidatorForTitle.message;
                        }

                        if( responseFromValidatorForType.result ) {
                            hasAnyValidationFailed = true;

                            itemErr.type = true;
                            itemErrMsg.type = responseFromValidatorForTitle.message;
                        }

                        if( responseFromValidatorForHalfPrice.result ) {
                            hasAnyValidationFailed = true;

                            itemErr.price.half = true;
                            itemErrMsg.price.half = responseFromValidatorForTitle.message;
                        }

                        if( responseFromValidatorForFullPrice.result ) {
                            hasAnyValidationFailed = true;

                            itemErr.price.full = true;
                            itemErrMsg.price.full = responseFromValidatorForTitle.message;
                        }

                        categoryError.item.push( itemErr );
                        categoryErrorMsg.items.push( itemErrMsg );
                    }
                }

                err.menu.push( categoryError );
                errMsg.menu.push( categoryErrorMsg );
            }
        }
    } else if( stage === 'imgUpload' ) {

        /* AddRegex and Validator method for imagep path. [a-zA-Z_-]+.(jpg|jpeg|png)*/

            err = {
                image : {}
            };

        errMsg : {
            image : {}
        };

        var lgPath = newRestaurant.image.lgPath;
        var mdPath = newRestaurant.image.mdPath;
        var smPath = newRestaurant.image.smPath;
        var xsPath = newRestaurant.image.xsPath;

        var responseFromValidatorForLgPath = Validator.isImageFileNameNotValid( lgPath, true );
        var responseFromValidatorForMdPath = Validator.isImageFileNameNotValid( mdPath, true );
        var responseFromValidatorForSmPath = Validator.isImageFileNameNotValid( smPath, true );
        var responseFromValidatorForXsPath = Validator.isImageFileNameNotValid( xsPath, true );

        if( responseFromValidatorForLgPath.result ) {
            hasAnyValidationFailed = true;

            err.image.lg = true;
            errMsg.image.lg = responseFromValidatorForLgPath.message;
        }

        if( responseFromValidatorForMdPath.result ) {
            hasAnyValidationFailed = true;

            err.image.md = true;
            errMsg.image.md = responseFromValidatorForMdPath.message;
        }

        if( responseFromValidatorForSmPath.result ) {
            hasAnyValidationFailed = true;

            err.image.sm = true;
            errMsg.image.sm = responseFromValidatorForSmPath.message;
        }

        if( responseFromValidatorForXsPath.result ) {
            hasAnyValidationFailed = true;

            err.image.xs = true;
            errMsg.image.xs = responseFromValidatorForXsPath.message;
        }

    }

    if( hasAnyValidationFailed ){
        callback( appConstants.appErrors.validationError, {
            err : err,
            errMsg : errMsg,
            data : null,
            msg : appConstants.errorMessage.fillDetails
        });
    } else {
        var cityName = 'lucknow';
        RestaurantDBI.addNewRestaurant( cityName, newRestaurant, function( err, result ){
            if( err ){
                if( err === appConstants.appErrors.intentionalBreak ) {
                    console.log( err + ' Slug already in use.' );

                    callback( appConstants.appErrors.intentionalBreak, {
                        err : { slug : true},
                        errMsg: { slug : appConstants.errorMessage.slugInUse },
                        data : null,
                        msg : appConstants.errorMessage.removeError
                    });
                } else {
                    console.log( err );
                    callback( err, {
                        err : {},
                        errMsg : {},
                        data : null,
                        msg : appConstants.errorMessage.someError
                    });
                }
            } else {
                callback( null, {
                    err : {},
                    errMsg : {},
                    data : result,
                    msg :getSuccessMessage( newRestaurant.stage )
                });
            }
        });
    }

    console.log( 'In AdminRestaurantService | Finished Execution of addNewRestaurant' );
};

/* This method would be used to fetch the data of the restaurant using its slug. */
var getRestaurantInfoBySlug = function( slug, callback ) {
    console.log( 'In AdminRestaurantService | Starting Execution of getRestaurantInfoBySlug' );

    var responseFromValidatorForSlug = Validator.isSlugNotValid( slug, true );

    if( responseFromValidatorForSlug.result ) {
        callback( appConstants.appErrors.validationError, {
            err : {},
            errMsg : {},
            data : null,
            msg : responseFromValidatorForSlug.message
        });
    } else {
        var cityName = 'lucknow';

        RestaurantDBI.getRestaurantInfoBySlug( cityName, slug, function( err, result ) {
            if( err ) {
                console.log( err );
            } else {
                if( result == null ) {
                    callback( appConstants.appErrors.noRecordFound, {
                        err : {},
                        errMsg : {},
                        data : null,
                        msg : appConstants.errorMessage.noRecordFound
                    });
                } else {
                    callback( null, result );
                }
            }
        });
    }


    console.log( 'In AdminRestaurantService | Starting Execution of getRestaurantInfoBySlug' );
};

exports.addNewRestaurant = addNewRestaurant;
exports.getRestaurantInfoBySlug = getRestaurantInfoBySlug;

exports.getApprovedRestaurantList = getApprovedRestaurantList;
exports.getUnapprovedRestaurantList = getUnapprovedRestaurantList;