define([], function($scope){
    function restaurantDetailsController(){};
    return restaurantDetailsController;
});

function RestaurantOtherDetailsController($scope, $http, AppConstants, RestRequests, UserInfoProvider) {
    $scope.restaurant = {};

    $scope.err = {};
    $scope.errMsg = {};

    $scope.isServerError = false;

    $scope.isServerSuccess = false;
    $scope.successMessage = '';

    $scope.errorMessage = '';

    $scope.files = {};
    $scope.paths = {};

    $scope.init = function() {
        var requestName = AppConstants.restOwnServicePrefix + '/' + RestRequests.restaurant + '/' + UserInfoProvider.getAssignedRestaurantSlug();

        $http.get( requestName).success( function( data ) {
            console.log( data );
        })
            .error( function( data ) {
                console.log( data );
            });
    };

    $scope.$on('selectedFile', function ($event, args) {
        $scope.$apply($scope.files[args.type] = args.file);
    });

    $scope.isFileNotSelected = function (type) {
        if( typeof $scope.paths[ type ] === 'undefined' ) {
            return typeof $scope.files[ type ] === 'undefined' ? '' : 'noHeight';
        } else {
            return 'noHeight';
        }
    };

    $scope.isFileSelected = function (type) {
        if ( typeof $scope.paths[ type ] === 'undefined' ) {
            return typeof $scope.files[ type ] !== 'undefined' ? '' : 'noHeight';
        } else {
            return '';
        }
    };

    $scope.getFileName = function (type) {
        if( typeof $scope.paths[ type ] === 'undefined' ) {
            return typeof $scope.files[ type ] !== 'undefined' ? $scope.files[ type ].name : '';
        } else {
            return $scope.paths[type ].substr( $scope.paths[type ].lastIndexOf('/'));
        }
    };

    $scope.removeFile = function (type) {
        delete $scope.paths[type];
        delete $scope.files[type];
    };

    $scope.hasFieldError = function ( type, isFieldValue ) {

        if( isFieldValue ) {

            return type ? '' : 'noHeight';

        } else {

            return $scope.err[ type ] ? '' : 'noHeight';

        }
    };

    $scope.haveReceivedErrorFromServer = function() {
        return $scope.isServerError ? '' : 'noHeight';
    };

    $scope.haveReceivedSuccessFromServer = function(){
        return $scope.isServerSuccess ? '' : 'noHeight';
    };

    $scope.addAdditionalDetails = function() {
        var requestName = AppConstants.restOwnServicePrefix + '/' + RestRequests.restaurant + '/' + UserInfoProvider.getAssignedRestaurantSlug();

        $http({
            method: 'POST',
            url: requestName,
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("model", angular.toJson(data.model));

                if( typeof $scope.files.snip !== 'undefined' ) {

                    formData.append( 'snip', $scope.files.snip );

                }

                return formData;
            },

            data: { model: $scope.restaurant, files: $scope.files }
        }).
            success(function (data, status, headers, config) {
                $scope.isServerError = false;
                $scope.isServerSuccess = true;

                $scope.successMessage = data.msg;

                $scope.err = data.err;
                $scope.errMsg = data.errMsg;

                /* A little bit of stage handling. */
                $scope.restaurantStageIndex = $scope.restaurantStages.indexOf( $scope.restaurant.stage );

                if( $scope.restaurantStageIndex !== ($scope.restaurantStages.length -1 )) {
                    $scope.restaurant.stage = $scope.restaurantStages[ ++$scope.restaurantStageIndex ];
                }

                /* With this, we would be able to move to next tab automatically. */
                $rootScope.$broadcast('moveToPetooTab', $scope.restaurantStageIndex);
            }).
            error(function (data, status, headers, config) {
                $scope.isServerError = true;
                $scope.isServerSuccess = false;

                $scope.errorMessage = data.msg;

                if ($scope.restaurant.stage === 'restMenu') {
                    if( data.data != null ) {
                        $scope.restaurant.menu = data.data;
                        $scope.restMenu = data.data;
                    }
                } else {
                    $scope.err = data.err;
                    $scope.errMsg = data.errMsg;
                }
            });
    };
}