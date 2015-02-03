define([], function(){
	function TopController($scope){
	}
	return TopController;
});

function parentController($scope, DataStore, AppConstants, $location){
	console.log('Hi. I am parentController');

	$scope.appName = AppConstants.appName;

	$scope.goToLoginPage = function(){
		console.log('Going to Login Page');
		$location.path('/login');
	}


	//code for header

	$scope.searchCalled = function(){
         $scope.searchActive = true;
        $scope.$broadcast('newItemAdded');
    }
    $scope.searchDeactive = function(){
         $scope.searchActive = false;   
    }
    $scope.searchPage = true;
}