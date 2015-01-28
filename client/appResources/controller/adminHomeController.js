define([], function() {
    function adminHomeController($scope) {
    }
    return adminHomeController;
});

function homeAdminController($scope, $location){
	console.log("inside admin controller");

	$scope.admin = {};

	$scope.admin.newsFeed = [{newsType: "Order", time: "few seconds ago", orderFor: "Manish eating Point", orderBy: "Tom Thomas"},
							{newsType: "User", time: "few seconds ago", orderFor: "Manish eating Point", orderBy: "Tom Thomas"},
							{newsType: "Restaurant", time: "few seconds ago", orderFor: "Manish eating Point", orderBy: "Tom Thomas"},
							{newsType: "Reviews", time: "few seconds ago", orderFor: "Manish eating Point", orderBy: "Tom Thomas"}]

	console.log($scope.admin.newsFeed);

	$scope.goToRestaurant = function(){
		$location.path('/restaurantDetails');
		console.log("click working");
	}

	$scope.goToNewsDestinatoion = function(news){
		console.log("taking me there");
		console.log(news.newsType);

		if (news.newsType === "Restaurant") {
			console.log("clicked on Restaurant");
			$location.path('/adminRestaurant');
		};
	}
}