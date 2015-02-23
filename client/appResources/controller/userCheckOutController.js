define([], function() {
    function userCheckOutController($scope) {
    }
    return userCheckOutController;
});

function checkOutContoller ($scope) {

	console.log("inside checkout controller");

	$scope.isCollapsed = true;

	$scope.showAddress = function(){
		console.log("btn clicked");
		$scope.hideAddressBtn = true;
		$scope.isCollapsed = false;
	}

	$scope.cancelAddress = function(){
		$scope.hideAddressBtn = false;
		$scope.isCollapsed = true;
	}

	$scope.addressDeActive = true;

	$scope.addressSelected = function(index){
		$scope.addressActive = true;
		console.log("inside address selection...."+index);
	}

	$scope.address = [{name:"Address 1", destination:"TCS Awadh Park Vibhuti Khand Gomti Nagar Lucknow UP",
						phone:"9807170270", mail:"sattasaphire@gmail.com"},
						{name:"Address 2", destination:"TCS Awadh Park Vibhuti Khand Gomti Nagar Lucknow UP",
						phone:"9807170270", mail:"sattasaphire@gmail.com"}];

	$scope.checkOut = {};

	$scope.saveAddress = function(){
		if(null !== $scope.checkOut || $scope.checkOut === "" || angular.isUndefined($scope.checkOut)){
			$scope.address.push({
				name: "Address X",
				destination: $scope.checkOut.houseNo+$scope.checkOut.area+$scope.checkOut.landmark,
				phone: $scope.checkOut.contact,
				mail: $scope.checkOut.mail
			})
			
			$scope.hideAddressBtn = false;
			$scope.isCollapsed = true;
		}

		$scope.checkOut = null;
	}

	$scope.order = [{no:"1", name:"Paneer Butter Masala", price:"100", quantity:"2"},
					{no:"2", name:"Paneer Chilli", price:"240", quantity:"2"},
					{no:"3", name:"kabab Masala", price:"220", quantity:"2"},
					{no:"4", name:"Kadhai Paneer", price:"200", quantity:"2"}];

}