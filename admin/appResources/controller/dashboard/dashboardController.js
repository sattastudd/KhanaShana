define([], function() {
    function dashboardController($scope) {
    }
    return dashboardController;
});

function DashboardController($scope, $rootScope, $http, UserInfoProvider, DataStore, AppConstants, RestRequests){
	UserInfoProvider.handleUserStatus();

    $scope.users_canvas = {
        id : 'totalUsers',

        details : {
            to : 260,
            from : 0,
            duration : '1s'
        },

        circ : {
            color : '#c3554c',
            width : '20'
        },

        status : {
            color : '#CCCCCC',
            offset : -45,

            size : '100pt',
        },

        subHeading : {
            color : '#CCCCCC',
            text :  'Users',
            size : '40pt',
            offset :  50
        }
    };

    $scope.restaurant_canvas = {
        id : 'totalRestaurants',

        details : {
            from : 0,
            duration : '1s'
        },

        circ : {
            color : '#773296',
            width : '20'
        },

        status : {
            color : '#CCCCCC',
            offset : -45,

            size : '100pt',
        },

        subHeading : {
            color : '#CCCCCC',
            text :  'Restaurants',
            size : '30pt',
            offset :  50
        }
    };

    $scope.reviews_canvas = {
        id : 'totalReviews',

        details : {
            from : 0,
            duration : '1s'
        },

        circ : {
            color : '#499231',
            width : '20'
        },

        status : {
            color : '#CCCCCC',
            offset : -45,

            size : '100pt',
        },

        subHeading : {
            color : '#CCCCCC',
            text :  'Reviews',
            size : '40pt',
            offset :  50
        }
    };

    $scope.orders_canvs = {
        id : 'totalOrders',

        details : {
            from : 0,
            duration : '1s'
        },

        circ : {
            color : '#c7568f',
            width : '20'
        },

        status : {
            color : '#CCCCCC',
            offset : -45,

            size : '100pt',
        },

        subHeading : {
            color : '#CCCCCC',
            text :  'Orders',
            size : '40pt',
            offset :  50
        }
    };

    if( DataStore.isKeyDefined( 'stats')){
	    var stats = DataStore.getData( 'stats' );


    }
    else {
        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.stats;

        $http.get( requestName )
            .success( function ( data ){

                $scope.users_canvas.details.to = data.data.users_count;
                $scope.restaurant_canvas.details.to = data.data.restaurant_count;
                $scope.reviews_canvas.details.to = data.data.reviews_count;
                $scope.orders_canvs.details.to = data.data.orders_count;

                $rootScope.$broadcast('startRenderingCanvas');
            })
            .error ( function ( data ){
                console.log( data );
            });
    }

};