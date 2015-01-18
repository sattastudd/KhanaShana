define([], function() {
    function UserIndexController($scope) {
    }
    return UserIndexController;
});

function userLandingPageController($scope, $log){
	$scope.welcomeText = "Welcome to KhanaShana. All in one destination for Foodies...";
	console.log("inside user landing pge controller");

	$scope.items = ['Bhilai','Delhi', 'Mumbai', 'Lucknow'];

	$scope.city = "Lucknow";

	$scope.selectCity = function(name){
		console.log("the city//////"+name);
		$scope.city = name;
	}

	 $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };
}