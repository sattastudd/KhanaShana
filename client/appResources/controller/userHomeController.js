define([], function() {
    function userHomeController($scope) {
    }
    return userHomeController;
});

function homeController($scope, $log, $location, $http, $filter, $timeout){
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
		$scope.showOptions = true;
		//console.log("the value for show options is>>>>"+$scope.showOptions);
	}

	$scope.showButton = function(){
		$scope.buttonHidden = false;	
		$scope.extendInput = false;
		$scope.showLocality = false;
		$scope.location = null;
		console.log("timeout working properly");
		//window.scrollTo(0, 0);
	}

	//for search options
	$scope.searchOption = ['Search By Locality', 'Search all the Restaurants in the City',
						 'Search all the Food Delivering in the City', 'Search all the Street Food joints in the City'];

	$scope.localities = ['Hazratganj', 'Gomtinagar', 'PatrakarPuram', 'Alambagh', 'Charbagh', 'Aliganj', 'Aminabad'];
	$scope.location = undefined;
	$scope.selectedOption = function(index){
		$scope.showOptions = false;
		$scope.buttonHidden = true;
		$scope.extendInput = true;
		//window.scrollTo(0, 400);
		document.getElementById("localityId").focus();
		console.log(index);
		if (index === 0) {
			$scope.showLocality = true;
		};
	}						 

}