
/* GET /todos listing. */
router.get('/locations/:id', function(req, res, next) {
  //Todo.find(function (err, todos) {
  //  if (err) return next(err);
  	if (req.params.id === 'lucknow'){
    	res.json([{'name':'gomtinagar'},{'name':'Patrakar'},{'name':'Chinhat'}]);
  	}
  	else{
  		res.json([]);
  	}
  //});
});