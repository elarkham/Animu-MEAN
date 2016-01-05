'use strict';
angular.module('main.client.controller', ['interceptor.client.service', 'me.client.service'])

.controller('authController', function($rootScope, $location, Auth, Me) {

	var vm = this;
	vm.loggedIn = Auth.isLoggedIn();

    // Makes sure user is logged during every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();

        Me.get().then(function(user){
            vm.user = user.data;
        });

	});

	vm.doLogin = function() {
		vm.processing = true;
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;

				if (data.success)
					$location.path('/');
				else
					vm.error = data.message;

			});
	};

	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';

		$location.path('/login');
	};

});

