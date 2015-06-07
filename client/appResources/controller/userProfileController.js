define([], function() {
    function userProfileController($scope) {
    }
    return userProfileController;
});

function profileController($scope, $rootScope, $http, DataStore, AppConstants, RestRequests, $modal, $window, $timeout, $location){

    $scope.order = [{
        orderNo: '123',
        restName: 'Waah ji Waah',
        cost: '250',
        orderTime: '11:11 AM',
        deliveredIn: '30 mins'
    }, {
        orderNo: '123',
        restName: 'Waah ji Waah',
        cost: '250',
        orderTime: '11:11 AM',
        deliveredIn: '30 mins'
    }, {
        orderNo: '123',
        restName: 'Waah ji Waah',
        cost: '250',
        orderTime: '11:11 AM',
        deliveredIn: '30 mins'
    }, {
        orderNo: '123',
        restName: 'Waah ji Waah',
        cost: '250',
        orderTime: '11:11 AM',
        deliveredIn: '30 mins'
    }, {
        orderNo: '123',
        restName: 'Waah ji Waah',
        cost: '250',
        orderTime: '11:11 AM',
        deliveredIn: '30 mins'
    }, {
        orderNo: '123',
        restName: 'Waah ji Waah',
        cost: '250',
        orderTime: '11:11 AM',
        deliveredIn: '30 mins'
    }, {
        orderNo: '123',
        restName: 'Waah ji Waah',
        cost: '250',
        orderTime: '11:11 AM',
        deliveredIn: '30 mins'
    }];

    $scope.toCheckOut = function(){
    	$location.path('/checkOut');
    }

    $scope.openBillModal = function () {
        var modalInstance = $modal.open({
            templateUrl : 'userBill.html',
            controller : 'billModalController',
            backdrop : 'static',
            windowClass    : 'darkTransparentBack',
            size : 'sm'
        });
	}

}

function billModalController($scope, $modalInstance, $location, DataStore, $window, $http, AppConstants, RestRequests, ValidationService, AppUtils){

	$scope.closeLoginModal = function (){
        $modalInstance.close();
    };
	console.log("inside modal location");

}