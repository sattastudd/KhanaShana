define([], function( $scope ) {
    function restaurantApprovalController(){
    };

    return restaurantApprovalController;
});

function RestaurantApprovalController( $scope, $http, $location, RestRequests, AppConstants, DataStore, AppUtils, ValidationService ) {

    var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.userList;

    $scope.isServerError = false;

    $scope.isServerSuccess = false;
    $scope.successMessage = '';

    $scope.errorMessage = '';

    $scope.searchParams = {
        role : 'restOwn',
        isAssigned : false
    };

    $scope.userList = [];
    $scope.listInfo = {
        currentPage : 1
    };

    $scope.globalPageSize = DataStore.getData( 'globalPageSize' );


    /* Initial method to send a request for unassigned users. */
    $scope.init = function() {
        if( DataStore.isKeyDefined( 'approvalForRestaurant' )) {
            $scope.restaurant = DataStore.readAndRemove( 'approvalForRestaurant' );

            $scope.search();
        } else {
            $location.path( '/restaurants/pendingApproval' );
        }
    };

    /* Function to return restaurant name */
    $scope.getRestaurantName = function() {
        return typeof $scope.restaurant === 'undefined' ? '' : $scope.restaurant.name;
    };

    /*Assign Restaurant To uSer */
    $scope.assignRestaurantToUser = function( user ) {
        console.log( user );
        console.log( $scope.restaurant );

        var requetName = AppConstants.adminServicePrefix + '/' + RestRequests.approveRestaurant;

        var payLoad = {
            restInfo : {
                name : $scope.restaurant.name,
                slug : $scope.restaurant.slug
            },

            userInfo : {
                name : user.name,
                email : user.email
            }
        };

        $http.post( requetName, payLoad)
            .success( function( data ) {
                $scope.isServerError = false;
                $scope.isServerSuccess = true;

                $scope.successMessage = data.msg;
            })
            .error( function( data ) {
                $scope.isServerSuccess = false;
                $scope.isServerError = true;

                $scope.errorMessage = data.msg;
            });
    };

    /* We need to get users list in the first hit. */
    $scope.search = function () {
        $http.post( requestName, $scope.searchParams )
            .success( function( data ) {
                console.log( data );

                $scope.userList = data.data.result;

                if( typeof data.data.count !== 'undefined' )
                    $scope.listInfo.totalItems = data.data.count;
            })
            .error( function( data ){
                $scope.isServerError = true;
                $scope.errorMessage = data.msg;
            })
    };

    $scope.searchUsers = function ($event) {

        var isNameBlank = AppUtils.isFieldBlank( $scope.searchParams.name );
        var isEmailBlank = AppUtils.isFieldBlank( $scope.searchParams.email );

        if( isNameBlank && isEmailBlank ){
            $scope.isServerError = true;
            $scope.serverResponse = ResponseMessage.errorMessage.noSearchCriteria;
        } else {
            if( !isNameBlank ){
                var result = ValidationService.isNameNotValid( $scope.searchParams.name, true );

                if( result.result ){
                    $scope.isServerError = true;
                    $scope.serverResponse = result.message;

                    return;
                }
            }

            if( !isEmailBlank ) {
                var result = ValidationService.isEmailNotValid( $scope.searchParams.email, true );

                if( result.result ){
                    $scope.isServerError = true;
                    $scope.serverResponse = result.message;

                    return;
                }
            }

            $scope.search();
        }

        $event.preventDefault();
        $event.stopPropagation();
    };

    /* Getters */
    $scope.haveReceivedErrorFromServer = function() {
        return $scope.isServerError ? '' : 'noHeight';
    };

    $scope.haveReceivedSuccessFromServer = function(){
        return $scope.isServerSuccess ? '' : 'noHeight';
    };

};
