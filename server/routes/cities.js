
/* GET /todos listing. */
router.get('/cities', function(req, res, next) {
  //Todo.find(function (err, todos) {
  //  if (err) return next(err);
    res.json(['lucknow']);
  //});
});