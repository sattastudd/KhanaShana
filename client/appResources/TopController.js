define([], function(){
	function TopController($scope){
	}
	return TopController;
});

function parentController($scope, DataStore, AppConstants, $location, $log){
    console.log('In parent Controller ');
    
    $scope.search = {
        searchText : '',
        searchType : '',
        searchPlaceHolder : ''
    };

    /*Header Controls*/
    $scope.visibilityControl = {
        isHomePage : false,
        isSeachActive : false,
        isLocationSearchActive : false
    };
    
    $scope.shouldShowSearch = function () {
        return !$scope.visibilityControl.isHomePage;
    }

    $scope.showSearch = function () {
        $scope.visibilityControl.isSearchActive = true;
        $scope.visibilityControl.isLocationSearchActive = false;
        $scope.search.searchPlaceHolder = 'Looking for meals ?';
    };

    $scope.showLocationSearch = function () {
        $scope.visibilityControl.isSearchActive = false;
        $scope.visibilityControl.isLocationSearchActive = true;
        $scope.search.searchPlaceHolder = 'Lokking for locality ?'
    };
}