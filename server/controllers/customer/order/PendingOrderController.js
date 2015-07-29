/* This controller file will deal with pending order operations. */

var ServerConstants = require( '../../../constants/ServerConstants' );
var PendingOrderService = require( '../../../serviceLayer/customer/order/PendingOrdersService' );

var request = require( 'request' );
var querystring = require('querystring');
var crypto = require( 'crypto' );

var addOrderIntoPendingOrdersList = function( req, res, next ) {
    logger.info( 'In PendingOrderController | Starting Execution of addOrderIntoPendingOrdersList' );

    var userEmail = req.user.email;
    var restaurantInfo = {
        name : req.body.restaurant.name,
        slug : req.body.restaurant.slug
    };

    var orderDishes = req.body.dishes;

    PendingOrderService.addOrderIntoPendingOrdersList( userEmail, restaurantInfo, orderDishes, function( err, result ) {
        if( err ) {
            if( err === ServerConstants.appErrors.validationError ) {
                res.status( 400).json( result );
            } else {
                res.status( 500).json( result );
            }
        } else {
            res.status( 200 ).json( result );
        }
    });

    logger.info( 'In PendingOrderController | Finished Execution of addOrderIntoPendingOrdersList' );
};

var checksum = function (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
};

var getNecessaryData = function( req, res, next ) {
    console.log(checksum('Z5B4BA|1|100|Farzi|Gaurav|er.grvtiwari@gmail.com|||||||||||cvLpoeI4', 'sha512') );
    res.status( 200).json( {
        'key': 'Z5B4BA',
        'txnid': '1',
        'amount': '100',
        'productinfo': 'Farzi',
        'firstname': 'Gaurav',
        'email': 'er.grvtiwari@gmail.com',
        'phone': '9807623337',
        'surl': 'www.peturaam.com/node/public/consume',
        'furl': 'www.peturram.com/node/public/fail',
        'hash': checksum('Z5B4BA|1|100|Farzi|Gaurav|er.grvtiwari@gmail.com|||||||||||cvLpoeI4', 'sha512'),
        'plainHash' : 'Z5B4BA|1|100|Farzi|Gaurav|er.grvtiwari@gmail.com|||||||||||cvLpoeI4',
        'service_provider': 'payu_paisa'
    });
};


exports.addOrderIntoPendingOrdersList = addOrderIntoPendingOrdersList;
exports.sendRequestToPayU = getNecessaryData;