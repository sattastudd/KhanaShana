define([], function() {
    function dashboardController($scope) {
    }
    return dashboardController;
});

function DashboardController($scope, $http, UserInfoProvider, DataStore, AppConstants, RestRequests){
	UserInfoProvider.handleUserStatus();

    if( DataStore.isKeyDefined( 'stats'))
	    var stats = DataStore.getData( 'stats' );
    else {
        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.stats;

        $http.get( requestName )
            .success( function ( data ){
                console.log( data );
            })
            .error ( function ( data ){
            console.log( data );
            });
    }
	console.log( stats );
};