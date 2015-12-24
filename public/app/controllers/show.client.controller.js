'use strict';
angular.module('show.client.controller', ['show.client.service'])

.controller('showController', function( Show, Auth ) {

var vm = this;

// set a processing variable to show loading things
vm.processing = true;
vm.perPage = 30;
vm.query = "";

// grab all the shows at page load
Show.all().success(function(data) {

        // when all the shows come back, remove the processing variable
        vm.processing = false;

        // bind the shows that come back to vm.shows
        vm.shows = data;
    });

})

.controller('showHomeController', function( Show, Auth ) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

    //Gets most recent watched by user, this selects 5.
    Auth.getUser(5).then(function(user_request){
        vm.recent = user_request.data.shows_watched;
    });

	Show.all( 'current_recent_updated' )
		.success(function(data) {

			// bind the shows that come back to vm.shows
			vm.current_shows = data;
		});

	Show.all( 'archive_recent_added' )
		.success(function(data) {

            vm.processing = false;

			// bind the shows that come back to vm.shows
			vm.archive_shows = data;
		});

})

.controller('showTagController', function( $routeParams, Show ) {

	var vm = this;

    var tag = $routeParams.tag;

    vm.title = $routeParams.title;
    vm.tag = tag;
    vm.perPage = 30;
    vm.query = "";

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the shows at page load
	Show.all( tag )
		.success(function(data) {

			// when all the shows come back, remove the processing variable
			vm.processing = false;

			// bind the shows that come back to vm.shows
			vm.shows = data;
		});

})
// controller applied to show creation page
.controller('showCreateController', function(Show) {

	var vm = this;

	// variable to hnamee/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a show
	vm.saveShow = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the showService
		Show.create(vm.showData)
			.success(function(data) {
				vm.processing = false;

                // bind the message from our API to vm
				vm.message = data.message;
                vm.success = data.success;
			});

	};

})

// controller applied to show edit page
.controller('showEditController', function($routeParams, Show) {

	var vm = this;

	// variable to show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the show data for the show you want to edit
	// $routeParams is the way we grab data from the URL
	Show.get($routeParams.show_name)
		.success(function(data) {
			vm.showData = data;
		});

	vm.saveShow = function() {
		vm.processing = true;
		vm.message = '';

		Show.update($routeParams.show_name, vm.showData)
			.success(function(data) {
				vm.processing = false;

				// bind the message from our API to vm
				vm.message = data.message;
                vm.success = data.success;
			});
	};

})

// controller applied to show profile page
.controller('showProfileController', function($routeParams, Show) {

	var vm = this;

    // $routeParams is the way we grab data from the URL
	Show.get($routeParams.show_name)
		.success(function(data) {
			vm.showData = data;
		});


});

