angular.module('animu', ['ngAnimate', 'app.routes', 'authService', 'authCtrl', 'userCtrl', 'userService'])

// application config to integrate token into requests
.config(function($httpProvider){

        $httpProvider.interceptors.push('AuthInterceptor');

});
