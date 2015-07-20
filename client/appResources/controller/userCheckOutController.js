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
	};

	$scope.address = [{name:"Satish Mishra", destination:"TCS Awadh Park Vibhuti Khand Gomti Nagar Lucknow UP",
						phone:"9807170270", mail:"sattasaphire@gmail.com"},
						{name:"Satish Mishra", destination:"TCS Awadh Park Vibhuti Khand Gomti Nagar Lucknow UP",
						phone:"9807170270", mail:"sattasaphire@gmail.com"}];

	$scope.checkOut = {};

	$scope.reviewCollapsed = true;

	$scope.reviewBlockClicked = function(){
		$scope.reviewCollapsed = !$scope.reviewCollapsed;		
	};

	$scope.addressCollapsed = false;

	$scope.addressBlockClicked = function(){
		$scope.addressCollapsed = !$scope.addressCollapsed;
	};

	$scope.paymentCollapsed = true;

    $scope.getClassForBoxes = function( index ) {
        var classToReturn = '';

        if( index > 3 ) {
            classToReturn = classToReturn + 'tMar15 ';
        }

        index = index % 3;

        if( index == 0) {
            return classToReturn + 'noRPad';
        } else if ( index == 2) {
            return  classToReturn + 'noRPad noLPad';
        }
        return classToReturn + 'noLPad';
    };



	$scope.paymentBlockClicked = function(){
		$scope.paymentCollapsed = !$scope.paymentCollapsed;
		console.log("payment block clicked");
	};

    $scope.order= DataStore.getData('dishShortlisted');
	/*$scope.order = [{no:"1", dish:"Shami kabab", price:"100", quantity:"2"},
					{no:"2", dish:"Galatians kaba", price:"240", quantity:"2"},
        {no:3, dish: 'Gol Roti', price : 10, quantity: 4},
        {no:4, dish: 'Sukhi Roti', price : 10, quantity: 4}];*/

    $scope.getTotalCost = function() {
        var totalCost = 0;

        angular.forEach( $scope.order, function( order ) {
            totalCost = totalCost + ( order.quantity * order.price );
        });

        return totalCost;
    };


    console.log( $scope.order );

	$scope.openAddressModal = function(){
            $modal.open({
                templateUrl : 'views/modals/address/addressModal.html',
                controller : 'AddressModalController',
                windowClass    : 'darkTransparentBack',
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