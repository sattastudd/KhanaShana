define([], function() {
    function userHomeController($scope) {
    }
    return userHomeController;
});

function homeController($scope, $log, $location, $http, $filter){
	/*$scope.welcomeText = "Welcome to KhanaShana. All in one destination for Foodies...";
	console.log("inside user landing pge controller");

	//$scope.items = ['Bhilai','Delhi', 'Mumbai', 'Lucknow'];
	
	$scope.status = {
    	isopen: false
  	};

  	$scope.user = {};

  	 $scope.onSelect = function ($item, $model, $label) {
    $scope.$item = $item;
    $scope.$model = $model;
    $scope.$label = $label;
    $scope.localitySelected = true;
    $scope.user.location = $scope.$item.name;
    console.log($scope.$item.name);
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
		$location.path('/restaurantDetails');
		console.log("the go button");
	}

	$scope.goSearch = function(){
		$location.path('/adminHome');
	}

	$http({ method: 'GET', url: '/node/cities' }).
  		success(function (data) {
  			console.log(data);
  			$scope.cities = data;
  }).
  error(function (data) {
    // ...
  });*/

	//for city button
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

	$scope.hideButton = function(){
		$scope.buttonHidden = true;
		$scope.extendInput = true;
		window.scrollTo(0, 400);
	}

	$scope.showButton = function(){
		$scope.buttonHidden = false;	
		$scope.extendInput = false;

		window.scrollTo(0, 0);
	}

}