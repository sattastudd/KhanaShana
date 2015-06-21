/* This controller would facilitate retrieval of global data.
 */

var publicService = require('../serviceLayer/public/PublicService');
var AppConstants = require('../constants/ServerConstants');

var getGlobalDataForCity = function (request, response, next) {

    logger.info('In globalDataController | Starting Execution of getGlobalDataForCity');


    publicService.getGlobalData(function (err, result) {

        if (err) {
            response.status(500)
                .json({
                    err: AppConstants.errorMessage.someError
                });
        } else {
            response.status(200)
                .json(result);
        }
    });

    logger.info('In globalDataController | Finished Execution of getGlobalDataForCity');
};

/**
 * Public Method to getAllLocationsFromDB.
 */
var getAllLocations = function (req, res, next) {
    logger.info('In globalDataController | Starting Execution of getAllLocations');

    publicService.getAllLocations(function (err, result) {
        if (err) {
            res.status(500)
                .json({
                    err: AppConstants.errorMessage.someError
                });
        } else {
            res.status(200)
                .json(result);
        }
    });

    logger.info('In globalDataController | Finished Execution of getAllLocations');
};

exports.getGlobalData = getGlobalDataForCity;
exports.getAllLocations = getAllLocations;