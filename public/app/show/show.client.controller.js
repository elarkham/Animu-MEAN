'use strict';
angular.module('show.client.controller', ['show.client.service'])

// Simple list of all the Shows
.controller('showController', function($routeParams, Show) {

	var vm = this;
    vm.perPage = 30;
    vm.query = "";

    Show.all().success(function(data) {
        vm.processing = false;
        vm.shows = data;
    });

    vm.deleteShow = function( show_name ){
        vm.processing = true;

        Show.delete(show_name).success(function(data){
            Show.all().success(function(data){
                vm.processing = false;
                vm.media = data;
            });
        });
    }

})


/* This is what lists the shows on our home page, this might
 * be moved to the main controller if additions are made beyond
 * the scope of just listing shows. But for now this is the most
 * appropriate location.
 */
.controller('showHomeController', function( Show, Auth ) {

 	 var vm = this;

	vm.processing = true;

    //========================================================
    //  User's Last Watched
    //========================================================
    Auth.getUser(5).then(function(user_request){
        vm.recent = user_request.data.shows_watched;
    });

    //========================================================
    //  Most Recently Updated Current Season Shows
    //========================================================

    // Define the Query
    var current_recent_updated =
         {
          'tags[]'   : ['current'],
          'limit' :  5,
          'sort'  : 'updated_at',
          'order' :  -1,
          'load'  : 'light'
         };

    Show.all( current_recent_updated ).success(function(data) {
			vm.current_shows = data;
	});

    //========================================================
    //  Most Recently Added Shows that are not Current Season
    //========================================================

    // Define the Query
    var archive_recent_added =
         {
          'excludes[]': ['current'],
          'limit'  :  5,
          'sort'   : 'created_at',
          'order'  :  -1,
          'load'   : 'light'
         };

	Show.all( archive_recent_added ).success(function(data) {
            vm.processing = false;
			vm.archive_shows = data;
	});

})

/* The tag controller is used over many pages to show different
 * groups of shows based on what their 'tag' is. The tags are
 * determined by information entered into the URN. To make this
 * work I had to do a small hack in the route provider to tell us
 * what tag we should query for as well as the official 'title'
 * for the tag that we will present to the user in our header.
 */
.controller('showTagController', function( $routeParams, Show ) {

	var vm = this;

    var tag = $routeParams.tag;

    vm.title = $routeParams.title;
    vm.tag = tag;
    vm.perPage = 30;
    vm.query = "";

	vm.processing = true;

    // Define the Query
    var tag_query =
        {
         'tags[]'  : [tag],
         'sort' : 'name',
         'order':  -1
        };

    console.log(tag_query);

	Show.all( tag_query ).success(function(data) {
	    vm.processing = false;
		vm.shows = data;
	});

})

// Controller for the Show's Creation page
.controller('showCreateController', function(Show) {

	var vm = this;

    // Code for the submit button of our form
	vm.saveShow = function() {
		vm.processing = true;
		vm.message = '';

        //Update the page and server to reflect the addition
		Show.create(vm.showData).success(function(data) {
		    vm.processing = false;
			vm.message = data.message;
            vm.success = data.success;
		});

	};

})

// Controller for the Show's Edit page
.controller('showEditController', function($routeParams, Show) {

	var vm = this;

    Show.get($routeParams.show_name).success(function(data) {
	    vm.showData = data;
	});

    // Code for the submit button of our form
	vm.saveShow = function() {
		vm.processing = true;
		vm.message = '';

        //Update the page and server to reflect the changes
		Show.update($routeParams.show_name, vm.showData)
			.success(function(data) {
				vm.processing = false;
				vm.message = data.message;
                vm.success = data.success;
			});
	};

})

// Controller for the Show's Profile page
.controller('showProfileController', function($routeParams, Show) {

	var vm = this;

    //We only need the show's data, nothing fancy is required
	Show.get($routeParams.show_name).success(function(data) {
	    vm.showData = data;
	});

});

