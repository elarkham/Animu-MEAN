'use strict';
angular.module('authCtrl', [])

.controller('authController', function($rootScope, $location, Auth){

    var vm = this;

    vm.logginIn = Auth.isLoggedIn();

    $rootScope.$on('$routeChangeStart', function(){
        Auth.getUser()
            .then(function(data) {
                vm.user = data.data;
            });
    });

    vm.doLogin = function(){
        vm.processing = true;

        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
            .success(function(data) {
                vm.processing = false;

                if (data.success)
                    $location.path('/users');
                else
                    vm.error = data.message;

            });

    };

    vm.doLogout = function() {
        Auth.logout();
        vm.user = '';

        $location.path('/login');
    };

    vm.createSample = function(){
        Auth.createSampleUser();
    };

});
