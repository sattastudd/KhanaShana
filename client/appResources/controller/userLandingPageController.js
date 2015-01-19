define([], function() {
    function UserIndexController($scope) {
    }
    return UserIndexController;
});

function userLandingPageController($scope, $log, $location, $http, $filter, $resource){
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

	/* $http({ method: 'GET', url: 'http://192.168.0.100:3000/locations/lucknow'}).
  		success(function (data) {
  			console.log(data);
  			$scope.locations = data;
		  }).
		  error(function (data) {
		    // ...
		  });	*/


	 var cities = $resource('http://192.168.0.100:port/cities', {port: ':3000'}, {method: 'GET',isArray: false});
     cities.query().$promise.then(
        function(data){
        	$scope.cities = data;
        	console.log(data);
     	});




	$scope.selectCity = function(name){
		$scope.city = name;

		/*$http({ method: 'GET', url: 'http://192.168.0.100:3000/locations/'+$scope.city}).
  		success(function (data) {
  			console.log(data);
  			$scope.locations = data;
		  }).
		  error(function (data) {
		    // ...
		  });	*/
	}

	$scope.goButton = function(){
		$location.path('/userSearchResultPage.html');
		console.log("the go button");
	}

	/*$http({ method: 'GET', url: 'http://localhost:3000/cities' }).
  		success(function (data) {
  			console.log(data);
  			$scope.cities = data;
  }).
  error(function (data) {
    // ...
  });*/
}