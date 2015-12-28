'use strict';
angular.module('media.client.controller', ['media.client.service'])

// Simple list of all the Media
.controller('mediaController', function(Media) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;
    vm.perPage = 30;
    vm.query = "";

	// grab all the media at page load
	Media.all().success(function(data) {
	    vm.processing = false;
		vm.media = data;
	});

	vm.deleteMedia = function(name) {
		vm.processing = true;

		Media.delete(name).success(function(data) {
            Media.all().success(function(data) {
			    vm.processing = false;
				vm.media = data;
			});
		});

	};

})

// Controller for the Media's Creation page
.controller('mediaCreateController', function(Media) {

	var vm = this;

    // Code for the submit button of our form
	vm.saveMedia = function() {
		vm.processing = true;
		vm.message = '';

        //Update the page and server to reflect the addition
		Media.create(vm.mediaData)
			 .success(function(data) {
				vm.processing = false;
				vm.message = data.message;
                vm.success = data.success;
			 });

	};

})

// Controller for the Media's Edit page
.controller('mediaEditController', function($routeParams, Media) {

	var vm = this;

	Media.get($routeParams.media_name).success(function(data) {
			vm.mediaData = data;
	});

    // Code for the submit button of our form
	vm.saveMedia = function() {
		vm.processing = true;
		vm.message = '';

        //Update the page and server to reflect the changes
		Media.update($routeParams.media_name, vm.mediaData)
			 .success(function(data) {
		        vm.processing = false;
				vm.message = data.message;
                vm.success = data.success;
			});
	};

})

// Controller for the Media's profile page, this is the page where
// the user will actually watch the video.
.controller('mediaProfileController', function($routeParams, Media) {

    var vm = this;

    vm.media_name = $routeParams.media_name;

	Media.get($routeParams.media_name)
		.success(function(data) {
			vm.mediaData = data;
            vm.path = 'assets/video/' + data.show.path +'/' + data.path;

            //This is configuration for the video player
            vm.config = {
                sources:[
                    {src: vm.path, type: "video/mp4"}
                ],
                theme: 'assets/libs/videogular-themes-default/videogular.css',
            }
	    });
})


