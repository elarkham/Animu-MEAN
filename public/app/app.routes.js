'use strict';
angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

        /* Site Routes
         ====================*/

		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'authController',
    		controllerAs: 'login'
		})

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html',
            controller  : 'showHomeController',
            controllerAs: 'home'
		})

        /* Profile Routes
         ====================*/
        //Shows a list of recently watched shows
        .when('/profile/recent', {
			templateUrl : 'app/views/pages/users/profile/recent.html',
			controller: 'userMeController',
            controllerAs: 'user'
		})

        /* OVA Routes
         ====================*/
        // show all OVA
		.when('/ova', {
			templateUrl: 'app/views/pages/shows/list.html',
			controller: 'showTagController',
			controllerAs: 'show',
            resolve: {
                tag: function($route){$route.current.params.tag = "ova"},
                title: function($route){$route.current.params.title = "OVA"}
            }
		})

        // page to show profile
		.when('/ova/:show_name', {
			templateUrl: 'app/views/pages/shows/profile.html',
			controller: 'showProfileController',
			controllerAs: 'show'
		})

        /* Series Routes
         ====================*/
        // show all OVA
		.when('/series', {
			templateUrl: 'app/views/pages/shows/list.html',
			controller: 'showTagController',
			controllerAs: 'show',
            resolve: {
                tag: function($route){$route.current.params.tag = "series"},
                title: function($route){$route.current.params.title = "Series"}
            }
		})

        // page to show profile
		.when('/series/:show_name', {
			templateUrl: 'app/views/pages/shows/profile.html',
			controller: 'showProfileController',
			controllerAs: 'show'
		})

        /* Movies Routes
         ====================*/
		.when('/movies', {
			templateUrl: 'app/views/pages/shows/list.html',
			controller: 'showTagController',
			controllerAs: 'show',
            resolve: {
                tag: function($route){$route.current.params.tag = "movies"},
                title: function($route){$route.current.params.title = "Movies"}
            }
		})

        // page to show profile
		.when('/movies/:show_name', {
			templateUrl: 'app/views/pages/shows/profile.html',
			controller: 'showProfileController',
			controllerAs: 'show'
		})

        /* Current Season Routes
         ====================*/
		.when('/current', {
			templateUrl: 'app/views/pages/shows/list.html',
			controller: 'showTagController',
			controllerAs: 'show',
            resolve: {
                tag: function($route){$route.current.params.tag = "current"},
                title: function($route){$route.current.params.title = "Current Season"}
            }
		})

        // page to show profile
		.when('/current/:show_name', {
			templateUrl: 'app/views/pages/shows/profile.html',
			controller: 'showProfileController',
			controllerAs: 'show'
		})
        /* User Managment Routes
         ====================*/

        // show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/edit/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

        // page to user profile
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/profile.html',
			controller: 'userProfileController',
			controllerAs: 'user'
		})
        /* Show Routes
         ====================*/

        // show all shows
		.when('/shows', {
			templateUrl: 'app/views/pages/shows/all.html',
			controller: 'showController',
			controllerAs: 'show'
		})

		// form to create a new show
		// same view as edit page
		.when('/shows/create', {
			templateUrl: 'app/views/pages/shows/create.html',
			controller: 'showCreateController',
			controllerAs: 'show'
		})

		// page to edit a show
		.when('/shows/edit/:show_name', {
			templateUrl: 'app/views/pages/shows/edit.html',
			controller: 'showEditController',
			controllerAs: 'show'
		})

        // page to show profile
		.when('/shows/:show_name', {
			templateUrl: 'app/views/pages/shows/profile.html',
			controller: 'showProfileController',
			controllerAs: 'show'
		})

        /* Media Routes
         ====================*/

        // show all media
		.when('/media', {
			templateUrl: 'app/views/pages/media/all.html',
			controller: 'mediaController',
			controllerAs: 'media'
		})

		// form to create a new media
		// same view as edit page
		.when('/media/create', {
			templateUrl: 'app/views/pages/media/create.html',
			controller: 'mediaCreateController',
			controllerAs: 'media'
		})

		// page to edit a media
		.when('/media/edit/:media_name', {
			templateUrl: 'app/views/pages/media/edit.html',
			controller: 'mediaEditController',
			controllerAs: 'media'
		})

        // page to view media
		.when('/media/:media_name', {
			templateUrl: 'app/views/pages/media/profile.html',
			controller: 'mediaProfileController',
			controllerAs: 'media'
		});

	$locationProvider.html5Mode(true);

});
