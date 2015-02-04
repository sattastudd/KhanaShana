define([], function(){
	function TopController($scope){
	}
	return TopController;
});

function parentController($scope, DataStore, AppConstants, $location, $log){
	console.log('Hi. I am parentController');

	$scope.appName = AppConstants.appName;

	$scope.goToLoginPage = function(){
		console.log('Going to Login Page');
		$location.path('/login');
	}


	//code for header

	$scope.searchCalled = function(){
        $scope.searchActive = true;
        $scope.hideLogin = true;
    }
    $scope.searchDeactive = function(){
         $scope.searchActive = false;
         $scope.hideLogin = false;
         $scope.showLocation = false;
    }
    
    $scope.locationCalled = function(){
    	$scope.showLocation = true;
    	$scope.hideLogin = true;
    }

    $scope.cities = ['Bhilai','Delhi', 'Mumbai', 'Lucknow'];
	$scope.status = {
    	isopen: false
  	};
	$scope.city = "Lucknow";
	$scope.toggled = function(open) {
	    $log.log('Dropdown is now: ', open);
	  };

	 $scope.selectCity = function(item){
		$scope.city = item;
	}
}