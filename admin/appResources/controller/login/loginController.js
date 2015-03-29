define([], function() {
    function loginController($scope) {
    }
    return loginController;
});

function LoginController($scope, $http, $window, $location, AppConstants, RestRequests, ValidationService, AppUtils, DataStore){

    /*Variable Initialization*/
    $scope.user = {
        email : '',
        password : ''
    };

    $scope.err = {};
    $scope.errMsg = {};

    $scope.hasAnyValidationFailed = false;
    $scope.isResponseFromServer = false;

    /* Utility Methods */
    $scope.setUpError = function (err, errMsg, type, resultFromValidation) {

        $scope.hasAnyValidationFailed = true;

        err[type] = resultFromValidation.result;
        errMsg[type] = resultFromValidation.message;
    };

    $scope.removeError = function (err, errMsg, type) {
        err[type] = false;
        errMsg[type] = '';
    };

    /* Validator Methods */
    $scope.isEmailNotValid = function (isMandatory) {

        if (!isMandatory) {
            isMandatory = false;
        }

        var result = ValidationService.isEmailNotValid($scope.user.email, isMandatory);

        if (result.result) {
            $scope.setUpError($scope.err, $scope.errMsg, 'email', result);
        } else {
            $scope.removeError($scope.err, $scope.errMsg, 'email');
        }
    };

    $scope.isPasswordNotValid = function (isMandatory){
        if(!isMandatory) {
            isMandatory = false;
        }

        if( $scope.user.password === '' && isMandatory){
            $scope.hasAnyValidationFailed = true;

            $scope.err.password = true;
            $scope.errMsg.password = 'Field can not be left empty.';
        } else {
            $scope.err.password = false;

            $scope.hasAnyValidationFailed = false;
        }
    };

    /*Action Methods*/
    $scope.loginUser = function (){

        $scope.isEmailNotValid( true );
        $scope.isPasswordNotValid( true );

        if( !$scope.hasAnyValidationFailed ) {

            var requestPath = AppConstants.httpServicePrefix + '/' + RestRequests.login;

            $http.post(requestPath, $scope.user)
                .success(function (data) {

                    $window.localStorage.token = data.user.user.token;

                    delete data.user.user.token;
                    $window.localStorage.user = JSON.stringify(data.user.user);

                    DataStore.storeData('stats', data.user.stats);

                    $location.path('/dashboard');
                })
                .error(function (data) {
                    $scope.err.email = data.err.email;
                    $scope.err.password = data.err.password;
                    $scope.errMsg = data.errMsg;

                    if (AppUtils.isObjectEmpty(data.err)) {
                        $scope.isResponseFromServer = true;
                        $scope.isServerError = true;
                        $scope.serverResponse = data.msg;
                    } else {
                        $scope.isResponseFromServer = false;
                        $scope.isServerError = false;
                        $scope.serverResponse = '';
                    }
                });
        }
    };

    /* Error Status Retriever Methods */
    $scope.hasEmailError = function () {
        return $scope.err.email ? '' : 'noHeight';
    };

    $scope.hasPasswordError = function (){
        return $scope.err.password ? '' : 'noHeight';
    };

    /* Server Message Status */
    $scope.haveReceivedResponseFromServer = function() {
        return $scope.isResponseFromServer ? '' : 'noHeight';
    };
};