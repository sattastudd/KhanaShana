define([], function() {
    function userSearchResultController($scope) {
    }
    return userSearchResultController;
});

function searchResultController ($scope){

    $scope.sort = [{name:'Manish Eating Point', img:'../images/pizza4.jpg'}, {name:'Waah ji Waah', img:'../images/northIndian.jpg'},
                    {name:'Mughal Dastarkhwan', img:'../images/thaali.jpg'},{name:'Tundey Kabab', img:'../images/pizza2.jpg'},
                    {name:'Royal Cafe', img:'../images/pizza1.jpg'}];

    $scope.showMenu = true;

    $scope.openMenu = function(){
        console.log("open menu button working");
        $scope.showMenu = !$scope.showMenu;
    }

    $scope.showQuickView = true;
    
    $scope.openQuickView = function(index){
        var current = $scope.sort[index];
        var status = current.showQuickView;
    
        for(var i=0; i<$scope.sort.length; i++){
            
            var obj = $scope.sort[i];
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
    }];

    //code for filter block

    $scope.filters = [{name: 'filters', list:['aloo', 'bhaloo', 'chaloo']}, 
                     {name: 'Cuisines', list:['hakoona', 'matata','oh shit']},
                     {name: 'Average Cost', list:['aloo', 'bhaloo', 'chaloo']},
                     {name: 'Minimum Cost', list:['aloo', 'bhaloo', 'chaloo']},
                     {name: 'Locality', list:['aloo', 'bhaloo', 'chaloo']},
                     {name: 'Restaurant Type', list:['aloo', 'bhaloo', 'chaloo']},
                     {name: 'Top 10', list:['aloo', 'bhaloo', 'chaloo']}];

    $scope.filterCollapse = true;

    $scope.filterClicked = function(index){
        console.log("inside filter clicked");

        var current = $scope.filters[index];
        var status = current.filterCollapse;
    
        for(var i=0; i<$scope.filters.length; i++){
            
            var obj = $scope.filters[i];
            obj.filterCollapse = true;
        }
        
        current.filterCollapse = !status;
    }

    $scope.contentSelected = function(value){
        //$scope.filterCollapse = false;
        console.log(value);
    }
}
