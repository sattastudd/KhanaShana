define([], function($scope){
    function userListController() {
    };
    return userListController;
});

function UserListController($scope, $http, $location, RestRequests, AppConstants, DataStore, ValidationService, ResponseMessage, AppUtils){
    console.log("Initializing Controller");
    /* Request Name for searching users. */
    var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.userList;

    $scope.searchParams = {};

    $scope.userList = [];
    $scope.listInfo = {
        currentPage : 1
    };

    $scope.roleSelected = '';

    $scope.isServerError = false;

    $scope.isServerSuccess = false;
    $scope.successMessage = '';

    $scope.serverError = '';


    $scope.globalPageSize = DataStore.getData( 'globalPageSize' );

    $scope.haveReceivedErrorFromServer = function() {
        return $scope.isServerError ? '' : 'noHeight';
    };

    $scope.haveReceivedSuccessFromServer = function(){
        return $scope.isServerSuccess ? '' : 'noHeight';
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
                console.log( data );
            })
    };

    $scope.initSearch = function() {
        $scope.searchParams.role = $scope.roleSelected;
        $scope.search();
    };

    $scope.getUsers = function () {
        $scope.searchParams.startIndex = (( $scope.listInfo.currentPage - 1 ) * $scope.globalPageSize ) + 1;
        $scope.search();
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

    $scope.resetSearch = function(){
        $scope.searchParams = {};

        $scope.search();
    };

    /* User Actions */
    /* BlackListing a user.*/
    $scope.blackListUser = function( user ) {
        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.blackListUser;

        var payLoad = {
            email : user.email,
            toBlackList : !user.isBlackListed
        };

        $http.post( requestName, payLoad)
            .success( function( data ) {
                user.isBlackListed = data.data;

                $scope.isServerSuccess = true;
                $scope.successMessage = $scope.getSuccessMessage( user, payLoad.toBlackList );

                $scope.isServerError = false;
            })
            .error( function( data ) {
                $scope.isServerSuccess = false;
                $scope.isServerError = true;

                $scope.serverResponse = data.msg;
            });
    };

    /* Editing a user */
    $scope.editUser = function( user ) {
        user.role = $scope.roleSelected;
        DataStore.storeData( 'isUserEdit', true );
        DataStore.storeData( 'toEditUser', user );

        $location.path( 'newUser' );
    };

    /* Method to make success message for user blacklisting' */
    $scope.getSuccessMessage = function( user, action ) {
        if( action ) {
            return user.name + ' blacklisted successfully.';
        } else {
            return user.name + ' permitted.';
        }
    };

    /* Method to check if a user role has been selected for searching. */
    $scope.isRoleSelected = function () {
        return ($scope.roleSelected === 'restOwn' || $scope.roleSelected === 'user' ) ? '' : 'noHeight';
    };
};