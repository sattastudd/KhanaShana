define([], function() {
    function userHomeController($scope) {
    }
    return userHomeController;
});

function homeController($scope, $log, $location, $http, $filter){
	$scope.welcomeText = "Welcome to KhanaShana. All in one destination for Foodies...";
	console.log("inside user landing pge controller");

	//$scope.items = ['Bhilai','Delhi', 'Mumbai', 'Lucknow'];
	
	$scope.status = {
    	isopen: false
  	};

	  $scope.toggled = function(open) {
	    $log.log('Dropdown is now: ', open);
	  };

	 $scope.city = "Lucknow";

	 $http({ method: 'GET', url: '/node/locations/lucknow'}).
  		success(function (data) {
  			console.log(data);
  			$scope.locations = data;
		  }).
		  error(function (data) {
		    // ...
		  });	

	$scope.selectCity = function(name){
		$scope.city = name;

		$http({ method: 'GET', url: '/node/locations/'+$scope.city}).
  		success(function (data) {
  			console.log(data);
  			$scope.locations = data;
		  }).
		  error(function (data) {
		    // ...
		  });	
	}

	$scope.goButton = function(){
		$location.path('/restaurantDetails.html');
		console.log("the go button");
	}

	$http({ method: 'GET', url: '/node/cities' }).
  		success(function (data) {
  			console.log(data);
  			$scope.cities = data;
  }).
  error(function (data) {
    // ...
  });
}