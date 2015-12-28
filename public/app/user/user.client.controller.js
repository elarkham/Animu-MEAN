'use strict';
angular.module('user.client.controller', ['user.client.service'])

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

// Controller for handling the current user
.controller('userMeController', function(User, Auth, Media) {
	var vm = this;
    var d;


    Auth.getUser().then(function(user_request){
        vm.userData = user_request.data;

        vm.userData.shows_watched.sort(compare);
        vm.userData.media_watched.sort(compare);

        vm.userData.shows_watched.splice( 10, vm.userData.shows_watched.length);
        vm.userData.media_watched.splice( 10, vm.userData.media_watched.length);
    });

    vm.format_date = function( date ){
        d = new Date(date);
        return d;
    }

    function compare(a,b) {
      if (vm.format_date(a.date) < vm.format_date(b.date))
        return 1;
      if (vm.format_date(a.date) > vm.format_date(b.date))
        return -1;
      return 0;
    }


    // Sends what they just watched to backend
    // TODO: Do this all server side
	vm.saveUserWatched = function(videoAPI, media_name) {
        Auth.getUser().then(function(user_request){
            Media.get(media_name).then(function(media_request){
                var media = media_request.data;
                var user  = user_request.data;
                var date  = new Date();

                var update = true;
                for(var i = 0; i < user.shows_watched.length; i++) {
                    if (user.shows_watched[i].data._id == media.show._id) {
                            update = false;
                            user.shows_watched[i].date = date;
                            break;
                    }
                }

                if( update ){
                    user.shows_watched.push(
                            {
                                data: media.show._id,
                                date: date,
                                seq:  0
                            });
                }

                update = true;
                for(var i = 0; i < user.media_watched.length; i++) {
                    if (user.media_watched[i].data._id == media._id) {
                            update = false;
                            user.media_watched[i].date = date;
                            break;
                    }
                }

                if( update ){
                    user.media_watched.push(
                            {
                                data: media._id,
                                date: date,
                                prog: 0
                            });
                }

//                user.media_watched.length = 0;
//                user.shows_watched.length = 0;


                console.log(user.name + " just watched " + media.name );
                console.log(user);

                User.update(user._id, user)
            });
        });
	};
})

// Controller for a Users general profile page
.controller('userProfileController', function($routeParams, User) {

	var vm = this;
    var d;

    vm.format_date = function( date ){
        d = new Date(date);
        return d;
    }

    function compare(a,b) {
      if (vm.format_date(a.date) < vm.format_date(b.date))
        return 1;
      if (vm.format_date(a.date) > vm.format_date(b.date))
        return -1;
      return 0;
    }

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
		.success(function(data) {
			vm.userData = data;
            vm.userData.shows_watched.sort(compare);
            vm.userData.media_watched.sort(compare);
		});

});
