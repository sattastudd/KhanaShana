define([], function() {
    function loginController($scope) {
    }
    return loginController;
});

function LoginController($scope, ValidationService, $http){

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

        console.log( result );

        if (result.result) {
            $scope.setUpError($scope.err, $scope.errMsg, 'email', result);
        } else {
            $scope.removeError($scope.err, $scope.errMsg, 'email');
        }
    };

    /*Action Methods*/
    $scope.loginUser = function (){
        $http.post('node/login', $scope.user)
            .success( function ( data ){
                console.log( data );
            })
            .error( function ( data ) {
                console.log( data );
            });
    };

    /* Error Status Retriever Methods */
    $scope.hasEmailError = function () {
        return $scope.err.email ;
    }

    /* Server Message Status */
    $scope.haveReceivedResponseFromServer = function() {
        return $scope.isResponseFromServer;
    };
};