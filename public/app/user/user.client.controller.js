'use strict';
angular.module('user.client.controller', ['user.client.service', 'me.client.service'])

// Lists all Users
.controller('userController', function(User) {

	var vm = this;
	vm.processing = true;

	User.all().success(function(data) {
			vm.processing = false;
			vm.users = data;
	});

	vm.deleteUser = function(id) {
		vm.processing = true;

        User.delete(id).success(function(data) {

            User.all().success(function(data) {
			    vm.processing = false;
				vm.users = data;
			});

		});
	};

})

// Controller for the User Creation page
.controller('userCreateController', function(User) {

	var vm = this;

    vm.type = 'create';

	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		User.create(vm.userData).success(function(data) {
				vm.processing = false;

                vm.message = data.message;
                vm.success = data.success;
		});

	};

})

// Controller for the User Edit page
.controller('userEditController', function($routeParams, User) {

	var vm = this;

	vm.type = 'edit';

    User.get($routeParams.user_id).success(function(data) {
	    vm.userData = data;
	});

	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		User.update($routeParams.user_id, vm.userData)
            .success(function(data) {
				vm.processing = false;

				vm.message = data.message;
                vm.success = data.success;
		    });
	};

})

// Controller for a Users general profile page
.controller('userDisplayController', function($routeParams, User) {

	var vm = this;

    vm.format_date = function( date ){
        var d = new Date(date);
        return d;
    }

    function compare(a,b) {
      if (vm.format_date(a.date) < vm.format_date(b.date))
        return 1;
      if (vm.format_date(a.date) > vm.format_date(b.date))
        return -1;
      return 0;
    }

	User.get($routeParams.user_id).success(function(data) {
	    vm.user_data = data;
        vm.user_data.show_history.sort(compare);
        vm.user_data.media_history.sort(compare);
        console.log(data);
	});

})


// Controller for current users recent shows page
.controller('userRecentController', function($routeParams, Me) {

	var vm = this;

    vm.format_date = function( date ){
        var d = new Date(date);
        return d;
    }

    function compare(a,b) {
      if (vm.format_date(a.date) < vm.format_date(b.date))
        return 1;
      if (vm.format_date(a.date) > vm.format_date(b.date))
        return -1;
      return 0;
    }

	Me.get().success(function(data) {
	    vm.user_data = data;
        vm.user_data.show_history.sort(compare);
        vm.user_data.media_history.sort(compare);
        console.log(data);
	});

});
