'use strict';
angular.module('user.client.controller', ['user.client.service'])

.controller('userController', function(User) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	User.all()
		.success(function(data) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.users = data;
		});

	// function to delete a user
	vm.deleteUser = function(id) {
		vm.processing = true;

		User.delete(id)
			.success(function(data) {

				// get all users to update the table
				// you can also set up your api
				// to return the list of users with the delete call
				User.all()
					.success(function(data) {
						vm.processing = false;
						vm.users = data;
					});

			});
	};

})

// controller applied to user creation page
.controller('userCreateController', function(User) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// saves user to the backend
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		User.create(vm.userData)
			.success(function(data) {
				vm.processing = false;

                vm.message = data.message;
                vm.success = data.success;
			});

	};

})

// controller applied to user edit page
.controller('userEditController', function($routeParams, User) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});

    // saves user to backend
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

// controller applied to current user
.controller('userMeController', function(User, Auth, Media) {
	var vm = this;

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
                    if( media &&
                      ( user.shows_watched[i].data.name==media.show.name ) ){
                        user.shows_watched[i].date = date;
                    }
                    if (user.shows_watched[i].data._id == media.show._id) {
                            update = false;
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
                    if( media &&
                      ( user.media_watched[i].data.name==media.name ) ){
                        user.media_watched[i].date = date;
                    }
                    if (user.media_watched[i].data._id == media._id) {
                            update = false;
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
// controller applied to user profile page
.controller('userProfileController', function($routeParams, User) {

	var vm = this;
    var d;

    vm.format_date = function( date ){
        d = new Date(date);
        return d;
    }

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});

});
