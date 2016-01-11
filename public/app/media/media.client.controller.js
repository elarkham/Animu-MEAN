'use strict';
angular.module('media.client.controller', ['media.client.service',
                                           'me.client.service'])

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

//================================================================
// Controller for actually watching the media as well as recording
// everthing and pushing it into the server under the user's account.
//
// TODO: Record watch time every 10 seconds, maybe with websockets?
//================================================================
.controller('mediaProfileController', function($routeParams, Media, Me, resolved_media) {

    var vm = this;
    vm.data = resolved_media.data; //Loaded in Router Provider, gives media object

    var show_path;
    if (!vm.data.show) show_path = '';
    else show_path = vm.data.show.path +'/';

    vm.path = 'assets/video/' + show_path + vm.data.path;

    //This is configuration for the video player
    vm.config = {
        sources:[ {src: vm.path, type: "video/mp4"} ],
        theme: 'assets/libs/videogular-themes-default/videogular.css'
    }

    // Sends what they just watched to backend
	vm.saveUserWatched = function(videoAPI) {
        var date    = new Date();
        var capsule = {};

        capsule.media_history = [];
        capsule.show_history  = [];

        capsule.media_history.push(
            {
                media: vm.data._id,
                date: date,
                prog: 0     //Not implemented yet
            });

        if (vm.data.show){
            capsule.show_history.push(
                {
                    show: vm.data.show._id,
                    date: date,
                    seq:  vm.data.seq
                });
        }

        Me.push(capsule)
	};

})


