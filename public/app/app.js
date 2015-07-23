angular.module('animu', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService'])

// application config to integrate token into requests
.config(function($httpProvider){

        $httpProvider.interceptors.push('AuthInterceptor');

});
