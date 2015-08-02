define([], function() {
    function orderConfirmationController($scope) {
    }
    return orderConfirmationController;
});

function orderConfirmController ($scope, $location){

	console.log('orderConfirmController');

	$scope.orderClicked() = function(){
		$location.path('/profile');
			console.log('orderConfirmController');
	}
}