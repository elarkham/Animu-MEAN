'use strict';
angular.module('interceptor.client.service', [])

// ===================================================
// Manages the user login information by sending
// authentication requests for us as well as deleting
// our token when we log out.
// ===================================================
.factory('Auth', function($http, $q, AuthToken) {
	var authFactory = {};

	authFactory.login = function(username, password) {

		return $http.post('/api/authenticate', {
			        username: username,
			        password: password
                })

                .success(function(data) {
				    AuthToken.setToken(data.token);
       			    return data;
			    });
	};

    // Logs out current user by deleting
    // their token from storage.
	authFactory.logout = function() {
		AuthToken.setToken();
	};

    // Determines if the user is logged in
    // by checking the local storage.
	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken())
			return true;
		else
			return false;
	};

    // Gets Logged in user
	authFactory.getUser = function(recent) {
		if (AuthToken.getToken())
			return $http({ url:'/api/me', method:'GET', params: { 'tag' : recent } });
        else
			return $q.reject({ message: 'User has no token.' });
	};

	return authFactory;

})

// ===================================================
// Handles the storage of our tokens
// ===================================================
.factory('AuthToken', function($window) {

	var authTokenFactory = {};

	// get the token out of local storage
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};

	// function to set token or clear token
	// if a token is passed, set the token
	// if there is no token, clear it from local storage
	authTokenFactory.setToken = function(token) {
		if (token)
			$window.localStorage.setItem('token', token);
	 	else
			$window.localStorage.removeItem('token');
	};

	return authTokenFactory;

})

// ===================================================
// Adds our token to all http requets. Allows for a
// stateless login without cookies.
// ===================================================
.factory('AuthInterceptor', function($q, $location, AuthToken) {

	var interceptorFactory = {};

	// this will happen on all HTTP requests
	interceptorFactory.request = function(config) {

		var token = AuthToken.getToken();

        // adds the token to our header
		if (token)
			config.headers['x-access-token'] = token;

		return config;
	};

	// What to do with response errors
	interceptorFactory.responseError = function(response) {

		if (response.status === 403) {
			AuthToken.setToken();
			$location.path('/login');
		}

		return $q.reject(response);
	};

	return interceptorFactory;

});
