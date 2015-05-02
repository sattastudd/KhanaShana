/*Controller is responsible for forwarding data to service layer.
 *And upon receiving, send the data back to client.
 */

var formidable = require( 'formidable' );
var easyImg = require( 'easyimage' );
var fs = require( 'fs' );

var createOrEditRestaurant = function( req, res, next ){

    var reqBody = {};
    var files = [];

    console.log('In restaurantController | Starting Execution of createOrEditRestaurant' );
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on( 'field', function( field, value ) {
        reqBody[field] = value;
    });

    form.on( 'file' , function(name, file ){

        var parseReqBody = JSON.parse( reqBody.model );

        var resizeObject = {
            cropwidth : 1140,
            cropheight: 400,

            x : Math.floor( parseReqBody.left * parseReqBody.ratioX ),
            y : Math.floor( parseReqBody.top * parseReqBody.ratioY )

            /*x : parseReqBody.left,
            y : parseReqBody.top*/
        };

        fs.rename( file.path, file.name, function( err ){

            files.push( file );

            resizeObject.src = file.name;
            resizeObject.dst = file.name;

            console.log( resizeObject );

            easyImg.crop( resizeObject ).then(
             function(image ){
                 console.log( image );
             },

             function ( err ) {
             console.log( 'IN error ' );
             console.log( err );
             }
             )
        });
    });

    form.on( 'end', function(){
        console.log( reqBody );

        console.log('Reading reqbody first body' );



        /*easyImg.crop({
            src : files[0].name,
            dst : files[0].name,

            cropwidth  : 1140,
            cropheight  : 400,


            x : Math.floor( reqBody.model.left * reqBody.model.ratio ),
            y : Math.floor( reqBody.model.top * reqBody.model.ratio )


        }).then(
            function(image ){
                console.log( image );
            },

            function ( err ) {
                console.log( 'IN error ' );
                console.log( err );
            }
        )*/


        res.status( 200 )
            .json({
                msg : 'Ok'
            });
    });

    form.parse( req );

    console.log( 'In restaurantController | Finished Execution of createOrEditRestaurant' );
};

exports.createOrEditRestaurant = createOrEditRestaurant;