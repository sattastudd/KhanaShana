define([], function() {
    function userSearchResultController($scope) {
    }
    return userSearchResultController;
});

function searchResultController ($scope){

	$scope.sort = ['Manish Eating Point', 'Waah ji Waah', 'Mughal Dastarkhwan', 'Tundey Kabab', 'amet', 'consectetur',
					'Lonnrem', 'Ipnnsum', 'dolomnnr', 'sjjjit', 'annmet', 'conbbsectetur'];
    
    $scope.isCollapsed = true;

    console.log("inside search result page");

    if(window.scrollTo(0, 400)){
        $scope.customizeVisible = true;
        console.log("its a miracle");
    }

    //for making circle

   /* var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.arc(100, 75, 50, 0, 2 * Math.PI);
	ctx.stroke();*/

}