/* GET /todos listing. */
/* Request-Name : /restaurants, Type : Get, Allowed : public */
router.get( '/restaurants/:id', function(req, res, next) {

	// Todo.find(function (err, todos) {
	// if (err) return next(err);
	if ( req.params.id === 'lucknow' ) {
		res.json( [ {
			'name' : 'Street Burger',
			'description' : 'blahasasasadda',
			'rating' : 2.5,
			'cusines' : [ 'Indian', 'Spanish' ],
			'minorder' : 250,
			'type' : 'street food',
			'map' : {
				'lat' : 25.356,
				'lng' : '67.898'
			},
			'specialties' : [ 'Burger', 'teeet', 'blahhh' ],
			'timings' : '1PM - 9PM',
			'deliverylocation' : {
				'gomtinagar' : '10min',
				'Chinhat' : '30min'
			},
			'address' : 'Patrakar',
			'phone' : '2928283031201'
		} ] );
	} else {
		res.json( [] );
	}
	// });
} );