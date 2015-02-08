define([], function() {
    function userSearchResultController($scope) {
    }
    return userSearchResultController;
});

function searchResultController ($scope){

	$scope.sort = ['Lorem', 'Ipsum', 'dolor', 'sit', 'amet', 'consectetur',
					'Lonnrem', 'Ipnnsum', 'dolomnnr', 'sjjjit', 'annmet', 'conbbsectetur'];
    
    $scope.isCollapsed = true;

    console.log("inside search result page");

    //for making circle

   /* var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.arc(100, 75, 50, 0, 2 * Math.PI);
	ctx.stroke();*/

}