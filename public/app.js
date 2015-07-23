angular.module('animu', ['ngAnimiate', 'app.routes', 'authCtrl', 'authService', 'userCtrl', 'userService'])

.config(function($httpProvider){

        $httpProvider.interceptors.push('AuthInterceptor');

});
