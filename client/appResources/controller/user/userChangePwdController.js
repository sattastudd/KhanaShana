define([], function() {
    function userChangePwdController($scope) {
    }
    return userChangePwdController;
});

function changePwdController ($scope,$location){

	console.log("inside change pwd");

	$scope.cancel = function(){

		$location.path('/')
	}

	$scope.reset = function(){

		$scope.pwd = null;
	}
}