define([], function() {
    function userSearchResultController($scope) {
    }
    return userSearchResultController;
});

function searchResultController ($scope, $http, AppConstants, RestRequests, DataStore ){

    if( DataStore.isKeyDefined( 'searchTaskInfo' )) {
        $scope.searchInfo = DataStore.readAndRemove( 'searchTaskInfo' );

        console.log( $scope.searchInfo );

        var searchRequestName = AppConstants.httpServicePrefix + '/' + RestRequests.restaurantSearch;

        var searchPayLoad = {};
        searchPayLoad[ $scope.searchInfo.type ] = $scope.searchInfo.text;

        $http.post( searchRequestName, searchPayLoad )
            .success( function( data ) {
                console.log( data );
            })
            .error( function( data ) {
                console.log( data );
            })
    }

    $scope.searchValue = 'all';

   /* var requestPath = AppConstants.httpServicePrefix + '/' + RestRequests.searchResult;

    $http.post(requestPath, $scope.searchValue)
    .success(function (data) {

        console.log('inside result post');

    })
    .error(function (data) {
        console.log('inside result post error');
    });

*/


    $scope.result = [{name:'Manish Eating Point', img:'../images/pizza4.jpg'}, {name:'Waah ji Waah', img:'../images/northIndian.jpg'},
                    {name:'Mughal Dastarkhwan', img:'../images/thaali.jpg'},{name:'Tundey Kabab', img:'../images/pizza2.jpg'},
                    {name:'Royal Cafe', img:'../images/pizza1.jpg'}];

    $scope.showMenu = true;

    $scope.openMenu = function(){
        console.log("open menu button working");
        $scope.showMenu = !$scope.showMenu;
    }

    /*$scope.showQuickView = true;
    
    $scope.openQuickView = function(index){
        var current = $scope.result[index];
        var status = current.showQuickView;
    
        for(var i=0; i<$scope.result.length; i++){
            
            var obj = $scope.result[i];
            obj.showQuickView = true;
        }
        
        current.showQuickView = !status;
    }    

    $scope.myInterval = 50000;
    $scope.quickViewContent = {};
    $scope.quickViewContent.aboutUs = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";
    $scope.quickViewContent.image = [{src:'http://lorempixel.com/400/200/'},{src:'http://lorempixel.com/400/200/food'},{src:'http://lorempixel.com/400/200/sports'},
                                    {src:'http://lorempixel.com/400/200/sports/1'},{src:'http://lorempixel.com/400/200/people'}];
    $scope.slides = [];
     $scope.slides = [
    {
      image: 'http://lorempixel.com/400/200/'
    },
    {
      image: 'http://lorempixel.com/400/200/food'
    },
    {
      image: 'http://lorempixel.com/400/200/sports'
    },
    {
      image: 'http://lorempixel.com/400/200/people'
    }];*/

    //code for filter block

    $scope.sortBy = ['Price','Rating','Popularity','Delivery Time','Open Now','Recently Ordered'];
    $scope.cuisines = ['North Indian','Mughlai','South Indian','Chinese','Punjabi','Italian','Rajasthani'];
    $scope.minDelivery = ['Below 200','200-300','300-400','400-500','Above 500'];
    $scope.avgCost = ['Below 200','200-300','300-400','400-500','Above 500'];
    $scope.restType = ['Budget','Class','Dhaba','Street','Family','Pub'];

    $scope.sortByCollapse = true;
    $scope.cuisineCollapse = true;
    $scope.minDelCollapse = true;
    $scope.avgCostCollapse = true;
    $scope.restTypeCollapse = true;

    $scope.sortByClicked = function(){
        console.log("collapse clicked");
        $scope.sortByCollapse = !$scope.sortByCollapse;
    }
    $scope.cuisineClicked = function(){
        $scope.cuisineCollapse = !$scope.cuisineCollapse;
    }
    $scope.minDeliveryClicked = function(){
        $scope.minDelCollapse = !$scope.minDelCollapse;
    }
    $scope.avgCostClicked =function(){
        $scope.avgCostCollapse = !$scope.avgCostCollapse;
    }
    $scope.restTypeClicked = function(){
        $scope.restTypeCollapse = !$scope.restTypeCollapse;
    }

    /*$scope.filterClicked = function(index){
        console.log("inside filter clicked");

        var current = $scope.filters[index];
        var status = current.filterCollapse;
    
        for(var i=0; i<$scope.filters.length; i++){
            
            var obj = $scope.filters[i];
            obj.filterCollapse = true;
        }
        
        current.filterCollapse = !status;
    }
*/
    $scope.contentSelected = function(value){
        //$scope.filterCollapse = false;
        console.log(value);
    }
}
