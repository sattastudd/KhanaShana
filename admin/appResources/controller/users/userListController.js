define([], function($scope){
    function userListController() {
    };
    return userListController;
});

function UserListController($scope, $http, RestRequests, AppConstants, DataStore, ValidationService, ResponseMessage, AppUtils){
    console.log("Initializing Controller");
    /* Request Name for searching users. */
    var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.userList;

    $scope.searchParams = {};

    $scope.userList = [];
    $scope.listInfo = {
        currentPage : 1
    };

    $scope.isResponseFromServer = false;
    $scope.serverError = '';

    $scope.globalPageSize = DataStore.getData( 'globalPageSize' );

    $scope.haveReceivedResponseFromServer = function() {
        return $scope.isResponseFromServer ? '' : 'noHeight';
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

    $scope.init = function() {
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
            $scope.isResponseFromServer = true;
            $scope.serverResponse = ResponseMessage.errorMessage.noSearchCriteria;
        } else {
            if( !isNameBlank ){
                var result = ValidationService.isNameNotValid( $scope.searchParams.name, true );

                if( result.result ){
                    $scope.isResponseFromServer = true;
                    $scope.serverResponse = result.message;

                    return;
                }
            }

            if( !isEmailBlank ) {
                var result = ValidationService.isEmailNotValid( $scope.searchParams.email, true );

                if( result.result ){
                    $scope.isResponseFromServer = true;
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
};