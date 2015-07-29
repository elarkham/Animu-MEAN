angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})

		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    		controllerAs: 'login'
		})

        /* User Routes
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
			templateUrl: 'app/views/pages/shows/single.html',
			controller: 'showCreateController',
			controllerAs: 'show'
		})

		// page to edit a show
		.when('/shows/edit/:show_name', {
			templateUrl: 'app/views/pages/shows/single.html',
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
			templateUrl: 'app/views/pages/media/single.html',
			controller: 'mediaCreateController',
			controllerAs: 'media'
		})

		// page to edit a media
		.when('/media/edit/:media_name', {
			templateUrl: 'app/views/pages/media/single.html',
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
