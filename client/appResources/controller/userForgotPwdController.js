define([], function() {
    function userForgotPwdController($scope) {
    }
    return userForgotPwdController;
});

function forgotPwdController ($scope,$location){

	console.log("inside change pwd");

	$scope.cancel = function(){

		$location.path('/')
	}

	$scope.reset = function(){

		$scope.pwd = null;
	}
}