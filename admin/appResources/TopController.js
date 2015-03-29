define( [], function() {

	function TopController($scope) {

	}
	return TopController;
} );

function ParentController($scope, $rootScope, $http, UserInfoProvider, DataStore, AppConstants, RestRequests, $modal, $window, $timeout, $location) {
    //Click listener on body.



    $scope.$on( 'closeUserContextMenu', function (){
        console.log( 'Caught Event' );
        $scope.visibilityControl.isUserContextMenuOpen = false;
    });

    $scope.broadCastCloseEvents = function () {
        console.log( 'On CLick ');
        $rootScope.$broadcast('closeSideBar');
    };

    $scope.isUserLoggedIn = function (){
      return UserInfoProvider.isUserLoggedIn();
    };



};

function HeaderController($scope, $http, $timeout, $location, UserInfoProvider ){

    $scope.visibilityControl = {
        isUserContextMenuOpen : false
    };

    $scope.getLoggedInUserName = function () {
        return UserInfoProvider.getLoggedInUserName();
    };

    $scope.getClassForUserContext = function () {
        return $scope.visibilityControl.isUserContextMenuOpen ? '' : 'noHeight';
    };

    $scope.toggleUserContextMenu = function () {
        $scope.visibilityControl.isUserContextMenuOpen = !$scope.visibilityControl.isUserContextMenuOpen;
    };

    /*Delayed delete of the user. So the context menu does not shows up undefined.*/
    $scope.delayedDelete = function () {
        $timeout( function () {
            UserInfoProvider.logoutUser();

            $timeout( function (){
                $location.path( '/login');
            }, 1000);
        }, 1000);
    };

    $scope.logoutUser = function () {

        /*$rootScope.$broadcast('closeUserContextMenu');*/
        $scope.visibilityControl.isUserContextMenuOpen = false;

        $http.post( 'node' + '/' + 'user/logout' , {})
            .success( function ( data ) {
                $scope.visibilityControl.isUserContextMenuOpen = false;

                $scope.delayedDelete();
            })
            .error( function ( data ) {
                $scope.visibilityControl.isUserContextMenuOpen = false;

                $scope.delayedDelete();
            });
    };
}