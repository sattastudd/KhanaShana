/*In here, we will handle Users Related Information
 */

var appConstants = require('../../../constants/ServerConstants');
var RestaurantDBI = require('../../../daoLayer/admin/restaurant/AdminRestaurantDBI');

var Validator = require('../../util/Validator');

var setUpError = function (err, errMsg, type, response) {
    
    if (type.split('.').length > 1) {
        
        var splitArray = type.split('.');
        var splitArrayLength = splitArray.length;
        
        if (splitArrayLength === 2) {
            var firstPart = splitArray[0];
            var secondPart = splitArray[1];
            
            if (typeof err[firstPart] === 'undefined') {
                err[firstPart] = {};
            }
            
            var tempOne = err[firstPart];
            tempOne[secondPart] = response.result;
            
            if (typeof errMsg[firstPart] === 'undefined') {
                errMsg[firstPart] = {};
            }
            
            var tempTwo = errMsg[firstPart];
            tempTwo[secondPart] = response.message;
            ;

        }


    } else {
        err[type] = response.result;
        errMsg[type] = response.message;
    }
};

/* Private method to return appropriate success method depending upon stage of restaurant. */
var getSuccessMessage = function (stage) {
    if (stage === 'basicDetails') {
        return appConstants.basicDetailsAdded
    }
};

/*                      Restaurant Creation Section Begin                    */
/*===========================================================================*/

/* This is public method to perform create operation on restaurants.
 * We will insert basic details with this method.
 * All other details would be performed in update method.
 * Except, approval functionality.
 */
var addNewRestaurant = function (newRestaurant, callback) {
    console.log('In AdminRestaurantService | Starting Execution of addNewRestaurant');
    
    var hasAnyValidationFailed = false;
    
    var err = {};
    var errMsg = {};
    
    
    var propArray = ['name', 'name | slug', 'name | street', 'name | locality', 'name | town', 'name | city', 'number | postal_code'];
    var propArrLen = propArray.length;
    
    for (var i = 0; i < propArrLen; i++) {
        var propName = propArray[i];
        
        var canBeSplit = propName.split('| ').length > 1;
        var type, propertyStoredIn, propValue = '';
        
        if (canBeSplit) {
            type = propName.split('|')[0].trim();
            propertyStoredIn = propName.split('|')[1].trim();
            
            
            propValue = newRestaurant[propertyStoredIn];

        } else {
            type = propName;
            propertyStoredIn = propName;
            
            propValue = newRestaurant[propertyStoredIn];
        }
        
        var responseFromValidatorForField = Validator.isFieldNotValidByType(propValue, true, type);
        
        if (responseFromValidatorForField.result) {
            hasAnyValidationFailed = true;
            
            setUpError(err, errMsg, propertyStoredIn, responseFromValidatorForField);
        }
    }
    
    if (!hasAnyValidationFailed) {
        newRestaurant.address = {
            street: newRestaurant.street,
            town: newRestaurant.town,
            city: newRestaurant.city,
            postal_code: newRestaurant.postal_code
        };
        
        var cityName = 'lucknow';
        
        RestaurantDBI.addNewRestaurant(cityName, newRestaurant, function (err, result) {
            if (err) {
                
                /* We are supposed to receive intentionalBreak error,
                 * when slug provided is already in use.
                 */
                if (err === appConstants.appErrors.intentionalBreak) {
                    console.log(err + ' Slug already in use.');
                    
                    callback(appConstants.appErrors.intentionalBreak, {
                        err: { slug: true },
                        errMsg: { slug: appConstants.errorMessage.slugInUse },
                        data: null,
                        msg: appConstants.errorMessage.removeError
                    });
                } else {
                    console.log(err);
                    callback(err, {
                        err: {},
                        errMsg: {},
                        data: null,
                        msg: appConstants.errorMessage.someError
                    });
                }
            } else {
                
                callback(null, {
                    err: {},
                    errMsg: {},
                    data: result,
                    msg: getSuccessMessage(newRestaurant.stage)
                });

            }
        });
    } else {
        
        callback(appConstants.appErrors.validationError, {
            err: err,
            errMsg: errMsg,
            data: null,
            msg: appConstants.errorMessage.fillDetails
        });

    }
    
    console.log('In AdminRestaurantService | Finished Execution of addNewRestaurant');
};

/*                      Restaurant Creation Section End                    */
/*===========================================================================*/

/*                       Restaurant Search Section Begin                     */
/*===========================================================================*/

/* This public method would handle all searchRelated functionality as well as data read functionality.
 * If any search criteria is provided, search would be done,
 * otherwise, plain data retrieval would be performed.
 */
var searchRestaurants = function (searchParams, pagingParams, callback) {
    console.log('In AdminRestaurantService | Finished Execution of searchRestaurants');
    
    var name = searchParams.name;
    var locality = searchParams.locality;
    var approved = searchParams.approved;
    
    var hasAnyValidationFailed = false;
    var responseMessage = '';
    
    var isNameBlank = Validator.isFieldEmpty(name);
    var islocalityBlank = Validator.isFieldEmpty(locality);
    var isApprovalBlank = Validator.isFieldEmpty(approved);
    
    if (isNameBlank) {
        delete searchParams.name;
    } else {
        
        var resultForName = Validator.isNameNotValid(name);
        
        if (resultForName.result) {
            hasAnyValidationFailed = true;
            responseMessage = resultForName.message;
        }
    }
    
    if (islocalityBlank) {
        delete searchParams.locality;
    } else {
        var resultForLocality = Validator.isNameNotValid(locality);
        
        if (resultForLocality.result) {
            hasAnyValidationFailed = true;
            responseMessage = resultForLocality.message;
        }
    }
    
    if (isApprovalBlank) {
        delete searchParams.approved;
    } else {
        if (searchParams.approved === 'true' || searchParams.approved) {
            searchParams.approved = true;
        } else if (searchParams.approved === 'false' || !searchParams.approved) {
            searchParams.approved = false;
        } else
            delete searchParams.approved;
    }
    
    if (hasAnyValidationFailed) {
        callback(appConstants.appErrors.validationError, {
            err : true,
            errMsg : responseMessage,
            data : null,
            msg : responseMessage
        });
        
        return;
    }
    
    if (!pagingParams.startIndex) {
        pagingParams.startIndex = 0;
    }
    
    searchParams.cityName = 'lucknow';
    
    RestaurantDBI.getRestaurantList(searchParams, pagingParams, function (err, result) {
        if (err) {
            console.log('In AdminRestaurantService ' + err);
            
            callback(appConstants.appErrors.someError, {
                err : {},
                errMsg : {},
                data : null,
                msg : appConstants.errorMessage.someError
            });
        } else {
            if (null == result || result.result.length === 0) {
                callback(appConstants.appErrors.noRecordFound, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : appConstants.errorMessage.noRecordFound
                });
            } else {
                callback(null, {
                    err : {},
                    errMsg : {},
                    data : result,
                    msg : appConstants.successMessage
                });
            }
        }
    });
    
    console.log('In AdminRestaurantService | Finished Execution of searchRestaurants');
};

/*                         Restaurant Search Section End                     */
/*===========================================================================*/

/*                 Restaurant Specific Data Read Section Start               */
/*===========================================================================*/

/* This method would be used to retrieve a particular restaurant's data.
 * We are going to identify a restaurant by its slug field.
 */
var readRestaurantSpecificData = function (slug, callback) {
    console.log('In AdminRestaurantService | Finished Execution of readRestaurantSpecificData');
    
    var responseFromValidatorForSlug = Validator.isNameNotValid(slug, true);
    
    var err = {};
    var errMsg = {};
    
    if (responseFromValidatorForSlug.result) {
        
        err.slug = true;
        errMsg.slug = responseFromValidatorForSlug.message;
        
        callback(appConstants.appErrors.validationError, {
            err : err,
            errMsg : errMsg,
            data : null,
            msg : appConstants.errorMessage.fillDetails
        });
    } else {
        var cityName = 'lucknow';
        
        RestaurantDBI.readRestaurantSpecificData(cityName, slug, function (err, result) {
            if (err) {
                console.log(err);
                
                callback(appConstants.appErrors.someError, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : appConstants.errorMessage.someError
                });
            } else {
                if (result == null) {
                    callback(appConstants.appErrors.noRecordFound, {
                        err : {},
                        errMsg : {},
                        data : null,
                        msg : appConstants.errorMessage.noRecordFound
                    });
                } else {
                    callback(null, {
                        err : {},
                        errMsg : {},
                        data : result,
                        msg : appConstants.successMessage
                    });
                }
            }
        });
    }
    
    console.log('In AdminRestaurantService | Finished Execution of readRestaurantSpecificData');
};

/*                 Restaurant Specific Data Read Section End               */
/*===========================================================================*/

/*                       Restaurant Update Section Begin                     */
/*===========================================================================*/

/* This public method would be used to update restaurant info in the system.
 * Restaurant would be identified by its slug field.
 * Restaurant details update would be performed in various stages.
 */
var updateRestaurantDetails = function (slug, restaurant, callback) {
    console.log('In AdminRestaurantService | Starting Execution of updateRestaurantDetails');
    
    var err = {};
    var errMsg = {};
    
    var hasAnyValidationFailed = false;
    
    /* Case if user wishes to update basic details itself. */
    if (restaurant.stage === 'basicDetails') {
        
        var propArray = ['name', 'name | slug', 'name | street', 'name | locality', 'name | town', 'name | city', 'number | postal_code'];
        var propArrLen = propArray.length;
        
        for (var i = 0; i < propArrLen; i++) {
            var propName = propArray[i];
            
            var canBeSplit = propName.split('| ').length > 1;
            var type, propertyStoredIn, propValue = '';
            
            if (canBeSplit) {
                type = propName.split('|')[0].trim();
                propertyStoredIn = propName.split('|')[1].trim();
                
                
                propValue = restaurant[ propertyStoredIn ];

            } else {
                type = propName;
                propertyStoredIn = propName;
                
                propValue = restaurant[ propertyStoredIn ];
            }
            
            var responseFromValidatorForField = Validator.isFieldNotValidByType(propValue, true, type);
            
            if (responseFromValidatorForField.result) {
                hasAnyValidationFailed = true;
                
                setUpError(err, errMsg, propertyStoredIn, responseFromValidatorForField);
            }
        }

        if (hasAnyValidationFailed) {
            callbacK(appConstants.appErrors.validationError, {
                err : err,
                errMsg : errMsg,
                data : null,
                msg : appConstants.errorMessage.fillDetails
            });
            return;
        }
    } else if (restaurant.stage === 'deliveryAreas') {
        var locationsArray = restaurant.locations;
        var locationsArrLength = locationsArray.length;
        
        if (locationsArrLength === 0) {
            err.locations = true;
            errMsg.locations = appConstants.errorMessage.noDeliveryArea
            
            callback(appConstants.appErrors.validationError, {
                err : err,
                errMsg : errMsg,
                data : null,
                msg : appConstants.errorMessage.noDeliveryArea
            });
            
            return;
        }
        
        var isAnyLocationInvalid = false;
        
        for (var i = 0; i < locationsArrLength; i++) {
            
            var locationName = locationsArray[ i ];
            
            var responseFromValidatorForLocNmae = Validator.isNameNotValid(locationName, true);
            
            if (responseFromValidatorForLocNmae.result) {
                isAnyLocationInvalid = true;
                break;
            }
        }
        
        if (isAnyLocationInvalid) {
            
            err.locations = true;
            errMsg.locations = appConstants.errorMessage.deliveryAreaInvalid
            
            callback(appConstants.appErrors.validationError, {
                err : err,
                errMsg : errMsg,
                data : null,
                msg : appConstants.appErrors.removeError
            });
            
            return
        }
    } else if (restaurant.stage === 'cuisineArea') {
        var cuisineArray = restaurant.cuisines;
        var cuisineArrLength = cuisineArray.length;
        
        if (cuisineArrLength === 0) {
            err.cuisines = true;
            errMsg.cuisines = appConstants.errorMessage.noCuisineSelected
            
            callback(appConstants.appErrors.validationError, {
                err : err,
                errMsg : errMsg,
                data : null,
                msg : appConstants.appErrors.removeError
            });
            
            return;
        }
        
        var isAnyCuisineInvalid = false;
        
        for (var i = 0; i < cuisineArrLength; i++) {
            
            var cuisineName = cuisineArray[ i ];
            
            var responseFromValidatorForCuisineName = Validator.isNameNotValid(cuisineName, true);
            
            if (responseFromValidatorForCuisineName.result) {
                isAnyCuisineInvalid = true;
                break;
            }
        }
        
        if (isAnyCuisineInvalid) {
            
            err.cuisines = true;
            errMsg.cuisines = appConstants.errorMessage.cuisineNameInvalid
            
            callback(appConstants.appErrors.validationError, {
                err : err,
                errMsg : errMsg,
                data : null,
                msg : appConstants.appErrors.removeError
            });
            
            return
        }
    } else if (restaurant.stage === 'restMenu') {
        var restMenu = restaurant.menu;
        
        if (!Array.isArray(restMenu) || restMenu.length === 0) {
            
            callback(appConstants.appErrors.validationError, {
                err : {},
                errMsg : {},
                data : null,
                msg : appConstants.appErrors.noMenuPresent
            });
            return;
        } else {
            var restMenuLength = restMenu.length;
            
            hasAnyValidationFailed = false;
            
            for (var i = 0; i < restMenuLength; i++) {
                var category = restMenu[ i ];
                
                var categoryError = category.err = {};
                var categoryErrorMsg = category.errMsg = {};
                
                /* Category Title Validation */
                var categoryTitle = category.title;
                
                var responseFromValidatorForCatTitle = Validator.isNameNotValid(categoryTitle, true);
                
                if (responseFromValidatorForCatTitle.result) {
                    
                    hasAnyValidationFailed = true;
                    
                    categoryError.title = true;
                    categoryErrorMsg.title = responseFromValidatorForCatTitle.message;
                }
                
                /* Cateogry Items Validation */
                var items = category.items;
                
                categoryError.items = [];
                categoryErrorMsg.items = [];
                
                if (!Array.isArray(items) || items.length === 0) {
                    categoryError.items = true;
                    categoryErrorMsg.items = appConstants.appErrors.noItemInCategory;
                } else {
                    
                    var itemsLength = items.length;
                    
                    for (var j = 0; j < itemsLength; j++) {
                        var itemAt = items[ j ];
                        
                        var itemErr = itemAt.err = {
                            price : {}
                        };
                        
                        var itemErrMsg = itemAt.errMsg = {
                            price : {}
                        };
                        
                        var itemTitle = itemAt.title;
                        var itemType = itemAt.type;
                        
                        var itemPriceHalf = itemAt.price.half;
                        var itemPriceFull = itemAt.price.full;
                        
                        var isItemVeg = itemAt.veg.toString();
                        
                        if (isItemVeg === '' || null == isItemVeg) {
                            hasAnyValidationFailed = true;
                            
                            itemErr.veg = true;
                            itemErrMsg.veg = 'Please select a value.'
                        } else if (isItemVeg !== 'true' && isItemVeg.toString() !== "false") {
                            hasAnyValidationFailed = true;
                            
                            itemErr.veg = true;
                            itemErrMsg.veg = 'Invalid value provided.';
                        }
                        
                        var responseFromValidatorForTitle = Validator.isNameNotValid(itemTitle, true);
                        var responseFromValidatorForType = Validator.isNameNotValid(itemType, true);
                        
                        var responseFromValidatorForHalfPrice = Validator.isNumberNotValid(itemPriceHalf, false);
                        var responseFromValidatorForFullPrice = Validator.isNumberNotValid(itemPriceFull, true);
                        
                        if (responseFromValidatorForTitle.result) {
                            hasAnyValidationFailed = true;
                            
                            itemErr.title = true;
                            itemErrMsg.title = responseFromValidatorForTitle.message;
                        }
                        
                        if (responseFromValidatorForType.result) {
                            hasAnyValidationFailed = true;
                            
                            itemErr.type = true;
                            itemErrMsg.type = responseFromValidatorForTitle.message;
                        }
                        
                        if (responseFromValidatorForHalfPrice.result) {
                            hasAnyValidationFailed = true;
                            
                            itemErr.price.half = true;
                            itemErrMsg.price.half = responseFromValidatorForTitle.message;
                        }
                        
                        if (responseFromValidatorForFullPrice.result) {
                            hasAnyValidationFailed = true;
                            
                            itemErr.price.full = true;
                            itemErrMsg.price.full = responseFromValidatorForTitle.message;
                        }
                    }
                }
            }

            if (hasAnyValidationFailed) {
                callback(appConstants.appErrors.validationError, {
                    err : {},
                    errMsg : {},
                    data : restMenu,
                    msg : appConstants.errorMessage.fillDetails
                });
                return;
            }
        }
    } else if (restaurant.stage === 'imgUpload') {
        var paths = restaurant.imagPaths;

        var arr = ['xs', 'sm', 'md', 'lg'];
        var arrLength = arr.length;

        for (var i = 0; i < arrLength; i++) {
            var fileName = paths[ arr[i] ];

            var responseFromValidatorForFileName = Validator.isFileNameNotValid(fileName);

            if (responseFromValidatorForFileName.result) {
                hasAnyValidationFailed = true;

                err[arr[i]]=  true;
                errMsg[arr[i]] = responseFromValidatorForFileName.message;
            } else {
                paths[arr[i]] = appConstants.imagePrefixPath + slug + '-' + arr[i] + paths[arr[i]].substr(paths[arr[i]].lastIndexOf('.'));
            }
        }

        if (hasAnyValidationFailed) {
            callback(appConstants.appErrors.validationError, {
                err : err,
                errMsg : errMsg,
                data : null,
                msg : appConstants.errorMessage.fillDetails
            });

            return;
        }
    }
    
          
        if (restaurant.stage === 'basicDetails') {
            restaurant.address = {
                street: restaurant.street,
                town: restaurant.town,
                city: restaurant.city,
                postal_code: restaurant.postal_code,
                locality : restaurant.locality
            };
        } else if (restaurant.stage === 'deliveryAreas') {
            restaurant.selectedLocations = restaurant.locations;
        } else if (restaurant.stage === 'cuisineArea') {
            restaurant.selectedCuisines = restaurant.cuisines;
        } else if (restaurant.stage === 'restMenu') {
            restaurant.menu = restMenu;
        } else if (restaurant.stage === 'imgUpload') {
            restaurant.paths = restaurant.imagPaths;
        }
        
        var cityName = 'lucknow';        
        
        RestaurantDBI.updateRestaurantDetails(cityName, slug, restaurant, function (err, updateCount) {
            if (err) {
                console.log(err);
                
                callback(appConstants.appErrors.someError, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : appConstants.errorMessage.someError
                });
            } else {
                if (updateCount == 1) {
                    callback(null, {
                        err : {},
                        errMsg : {},
                        data : true,
                        msg : appConstants.restaurantDetailsUpdated
                    });
                } else {
                    callback(appConstants.appErrors.someError, {
                        err : {},
                        errMsg : {},
                        data : null,
                        msg : appConstants.errorMessage.someError
                    });
                }
            }
        });
        
    
    
    console.log('In AdminRestaurantService | Finished Execution of updateRestaurantDetails');
};

/*                         Restaurant Update Section End                     */
/*===========================================================================*/

/*                                 Module Export                             */
/*===========================================================================*/
exports.addNewRestaurant = addNewRestaurant;
exports.searchRestaurants = searchRestaurants;
exports.updateRestaurantDetails = updateRestaurantDetails;

exports.readRestaurantSpecificData = readRestaurantSpecificData;