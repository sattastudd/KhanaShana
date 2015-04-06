define([], function($scope){
    function newRestaurantController(){
    };
    return newRestaurantController;
});

function NewRestaurantController( $scope ){
    $scope.collapseController = {
        basicInfo : false,
        address : true,
        co_ord : true
    };

    $scope.isExpanded = function(type){
      return $scope.collapseController[type] ? 'makeRightAngle' : '';
    };

    $scope.toggleExpand = function( type ){
      $scope.collapseController[type] = !$scope.collapseController[type];
    };
};
