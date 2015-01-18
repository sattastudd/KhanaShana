define([], function() {
    function UserIndexController($scope) {
    }
    return UserIndexController;
});

function userLandingPageController($scope, $log, $location){
	$scope.welcomeText = "Welcome to KhanaShana. All in one destination for Foodies...";
	console.log("inside user landing pge controller");

	$scope.items = ['Bhilai','Delhi', 'Mumbai', 'Lucknow'];
	
	$scope.status = {
    	isopen: false
  	};

	  $scope.toggled = function(open) {
	    $log.log('Dropdown is now: ', open);
	  };

	 $scope.city = "Lucknow";

	$scope.selectCity = function(name){
		$scope.city = name;
	}

	$scope.goButton = function(){
		$location.path('/userSearchResultPage.html');
		console.log("the go button");
	}

}