define([], function() {
    function userCheckOutController($scope) {
    }
    return userCheckOutController;
});

function checkOutContoller ($scope, $modal, $location, DataStore, $window, $http, AppConstants, RestRequests) {

	console.log("inside checkout controller");

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

	/*$scope.saveAddress = function(){
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
	}*/

	$scope.reviewCollapsed = true;

	$scope.reviewBlockClicked = function(){
		$scope.reviewCollapsed = !$scope.reviewCollapsed;		
	}

	$scope.addressCollapsed = false;

	$scope.addressBlockClicked = function(){
		$scope.addressCollapsed = !$scope.addressCollapsed;
	}

	$scope.paymentCollapsed = true;

	$scope.paymentBlockClicked = function(){
		$scope.paymentCollapsed = !$scope.paymentCollapsed;
		console.log("payment block clicked");
	}

	$scope.order = [{no:"1", name:"Paneer Butter Masala", price:"100", quantity:"2"},
					{no:"2", name:"Paneer Chilli", price:"240", quantity:"2"},
					{no:"3", name:"kabab Masala", price:"220", quantity:"2"},
					{no:"4", name:"Kadhai Paneer", price:"200", quantity:"2"}];

	$scope.showAddressModal = function(){
            $modal.open({
                templateUrl : 'views/modals/address/addressModal.html',
                controller : 'AddressModalController',
                size : 'sm',
                resolve : {
                    displayedOnPage : function() {
                       // return $scope.locations;
                    }
                }
            })
	}

}

function AddressModalController ($scope, $modalInstance, $location, DataStore, AppConstants, RestRequests, $http, displayedOnPage ) {

	console.log("inside address modal");

	$scope.closeModal = function(){
		$modalInstance.close();
	}

}