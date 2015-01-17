define(["../require/lazy-directives"], function(lazyDirectives) {
    var $controllerProvider, $compileProvider;
    function setControllerProvider(value) {
        $controllerProvider = value;
    }
    function setCompileProvider(value) {
        $compileProvider = value;
        lazyDirectives.setCompileProvider(value);
    }
    function config(templateUrl, controllerName, directives) {
        if (!$controllerProvider) {
            throw new Error("$controllerProvider is not set!");
        }
        var defer, html, routeDefinition = {};
        routeDefinition.templateUrl = templateUrl;
        routeDefinition.controller = controllerName;
        routeDefinition.resolve = {delay: function($q, $rootScope) {
                defer = $q.defer();
                if (!html) {
                    var dependencies = [controllerName];
                    if (directives) {
                        dependencies = dependencies.concat(directives);
                    }
                    require(dependencies, function() {
                        var controller = arguments[0];
                        for (var i = 2; i < arguments.length; i++) {
                            lazyDirectives.register(arguments[i]);
                        }
                        $controllerProvider.register(controllerName, controller);
                        defer.resolve();
                        $rootScope.$$phase || $rootScope.$apply();
                    });
                } else {
                    defer.resolve();
                }
                return defer.promise;
            }};
        return routeDefinition;
    }
    return {setControllerProvider: setControllerProvider,setCompileProvider: setCompileProvider,config: config};
});