'use strict';
angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

        /* Main Site Routes
         ====================*/

		// Login Page
		.when('/login', {
			templateUrl : 'app/authenticate/login.html',
   			controller  : 'authController',
    		controllerAs: 'login'
		})

		// Home Page
		.when('/', {
			templateUrl : 'app/home.html',
            controller  : 'showHomeController',
            controllerAs: 'home'
		})

        /* Profile Routes
         ====================*/
        //Shows a list of recently watched shows
        .when('/profile/recent', {
			templateUrl : 'app/user/views/profile/recent.html',
			controller: 'userMeController',
            controllerAs: 'user'
		})

        /* OVA Archive Routes
         ====================*/
        // show all OVA
		.when('/ova', {
			templateUrl: 'app/show/views/list.html',
			controller: 'showTagController',
			controllerAs: 'show',

            //Hack to let me relay what tag I want for this page when it
            //loads and what I want the offical "Title" at the top to be
            resolve: {
                tag: function($route){$route.current.params.tag = "ova"},
                title: function($route){$route.current.params.title = "OVA"}
            }
		})

        // Allows the tag to be in the URN when navigating to a show's profile
		.when('/ova/:show_name', {
			templateUrl: 'app/show/views/profile.html',
			controller: 'showProfileController',
			controllerAs: 'show'
		})

        /* Series Archive Routes
         ====================*/
        // show all OVA
		.when('/series', {
			templateUrl: 'app/show/views/list.html',
			controller: 'showTagController',
			controller: 'showTagController',
			controllerAs: 'show',

            //Hack to let me relay what tag I want for this page when it
            //loads and what I want the offical "Title" at the top to be
            resolve: {
                tag: function($route){$route.current.params.tag = "series"},
                title: function($route){$route.current.params.title = "Series"}
            }
		})

        // Allows the tag to be in the URN when navigating to a show's profile
		.when('/series/:show_name', {
			templateUrl: 'app/show/views/profile.html',
			controller: 'showProfileController',
			controllerAs: 'show'
		})

        /* Movies Archive Routes
         ====================*/
		.when('/movies', {
			templateUrl: 'app/show/views/list.html',
			controller: 'showTagController',
			controllerAs: 'show',

            //Hack to let me relay what tag I want for this page when it
            //loads and what I want the offical "Title" at the top to be
            resolve: {
                tag: function($route){$route.current.params.tag = "movies"},
                title: function($route){$route.current.params.title = "Movies"}
            }
		})

        // Allows the tag to be in the URN when navigating to a show's profile
		.when('/movies/:show_name', {
			templateUrl: 'app/show/views/profile.html',
			controller: 'showProfileController',
			controllerAs: 'show'
		})

        /* Current Season Routes
         ====================*/
		.when('/current', {
			templateUrl: 'app/show/views/list.html',
			controller: 'showTagController',
			controllerAs: 'show',

            //Hack to let me relay what tag I want for this page when it
            //loads and what I want the offical "Title" at the top to be
            resolve: {
                tag: function($route){$route.current.params.tag = "current"},
                title: function($route){$route.current.params.title = "Current Season"}
            }
		})

        // Allows the tag to be in the URN when navigating to a show's profile
		.when('/current/:show_name', {
			templateUrl: 'app/show/views/profile.html',
			controller: 'showProfileController',
			controllerAs: 'show'
		})
        /* User Managment Routes
         ====================*/

        // show all users
		.when('/users', {
			templateUrl: 'app/user/views/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/user/views/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/edit/:user_id', {
			templateUrl: 'app/user/views/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

        // page to user profile
		.when('/users/:user_id', {
			templateUrl: 'app/user/views/profile.html',
			controller: 'userProfileController',
			controllerAs: 'user'
		})
        /* Show Routes
         ====================*/

        // show all shows
		.when('/shows', {
			templateUrl: 'app/show/views/all.html',
			controller: 'showController',
			controllerAs: 'show'
		})

		// form to create a new show
		.when('/shows/create', {
			templateUrl: 'app/show/views/create.html',
			controller: 'showCreateController',
			controllerAs: 'show'
		})

		// page to edit a show
		.when('/shows/edit/:show_name', {
			templateUrl: 'app/show/views/edit.html',
			controller: 'showEditController',
			controllerAs: 'show'
		})

        // page to show profile
		.when('/shows/:show_name', {
			templateUrl: 'app/show/views/profile.html',
			controller: 'showProfileController',
			controllerAs: 'show'
		})

        /* Media Routes
         ====================*/

        // show all media
		.when('/media', {
			templateUrl: 'app/media/views/all.html',
			controller: 'mediaController',
			controllerAs: 'media'
		})

		// form to create a new media
		.when('/media/create', {
			templateUrl: 'app/media/views/create.html',
			controller: 'mediaCreateController',
			controllerAs: 'media'
		})

		// page to edit a media
		.when('/media/edit/:media_name', {
			templateUrl: 'app/media/views/edit.html',
			controller: 'mediaEditController',
			controllerAs: 'media'
		})

        // page to view media
		.when('/media/:media_name', {
			templateUrl: 'app/media/views/profile.html',
			controller: 'mediaProfileController',
			controllerAs: 'media'
		});

	$locationProvider.html5Mode(true);

});
