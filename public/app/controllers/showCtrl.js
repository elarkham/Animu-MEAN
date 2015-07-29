angular.module('showCtrl', ['showService'])

.controller('showController', function(Show) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the shows at page load
	Show.all()
		.success(function(data) {

			// when all the shows come back, remove the processing variable
			vm.processing = false;

			// bind the shows that come back to vm.shows
			vm.shows = data;
		});

	// function to delete a show
	vm.deleteShow = function( name ) {
		vm.processing = true;

		Show.delete( name )
			.success(function(data) {

				// get all shows to update the table
				// you can also set up your api
				// to return the list of shows with the delete call
				Show.all()
					.success(function(data) {
						vm.processing = false;
						vm.shows = data;
					});

			});
	};

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
				vm.message = data.message;
			});

	};

})

// controller applied to show edit page
.controller('showEditController', function($routeParams, Show) {

	var vm = this;

	// variable to hnamee/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the show data for the show you want to edit
	// $routeParams is the way we grab data from the URL
	Show.get($routeParams.show_name)
		.success(function(data) {
			vm.showData = data;
		});

	// function to save the show
	vm.saveShow = function() {
		vm.processing = true;
		vm.message = '';

		// call the showService function to update
		Show.update($routeParams.show_name, vm.showData)
			.success(function(data) {
				vm.processing = false;

				// bind the message from our API to vm.message
				vm.message = data.message;
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

