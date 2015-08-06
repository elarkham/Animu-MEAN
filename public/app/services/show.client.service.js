'use strict';
angular.module('show.client.service', [])

.factory('Show', function($http) {

	// create a new object
	var showFactory = {};

	// get a single show
	showFactory.get = function(name) {
		return $http.get('/api/shows/' + name);
	};

	// get all shows
	showFactory.all = function() {
		return $http.get('/api/shows/');
	};

	// create a show
	showFactory.create = function(showData) {
		return $http.post('/api/shows/', showData);
	};

	// update a show
	showFactory.update = function(name, showData) {
		return $http.put('/api/shows/' + name, showData);
	};

	// delete a show
	showFactory.delete = function(name) {
		return $http.delete('/api/shows/' + name);
	};

	// return our entire showFactory object
	return showFactory;

});
