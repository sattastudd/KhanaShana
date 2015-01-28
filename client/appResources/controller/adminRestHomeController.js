define([], function() {
    function adminRestHomeController($scope) {
    }
    return adminRestHomeController;
});

function restHomeController($scope){
	console.log("restaurant home page");

	$scope.restaurantList = [{name: "Manish Eating Point", Address: "PatrakarPuram Chauraha Gomti Nagar Lucknow", availability:"open",
							 noOfOrders: "12"},
							 {name: "Manish Eating Point", Address: "PatrakarPuram Chauraha Gomti Nagar Lucknow", availability:"open",
							 noOfOrders: "12"},
							 {name: "Manish Eating Point", Address: "PatrakarPuram Chauraha Gomti Nagar Lucknow", availability:"open",
							 noOfOrders: "12"},
							 {name: "Manish Eating Point", Address: "PatrakarPuram Chauraha Gomti Nagar Lucknow", availability:"open",
							 noOfOrders: "12"},
							 {name: "Manish Eating Point", Address: "PatrakarPuram Chauraha Gomti Nagar Lucknow", availability:"open",
							 noOfOrders: "12"}]

}