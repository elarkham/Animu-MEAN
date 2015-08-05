'use strict';
angular.module('mediaService', [])

.factory('Media', function($http) {

	// create a new object
	var mediaFactory = {};

	// get a single media
	mediaFactory.get = function(name) {
		return $http.get('/api/media/' + name);
	};

	// get all media
	mediaFactory.all = function() {
		return $http.get('/api/media/');
	};

	// create a media
	mediaFactory.create = function(mediaData) {
		return $http.post('/api/media/', mediaData);
	};

	// update a media
	mediaFactory.update = function(name, mediaData) {
		return $http.put('/api/media/' + name, mediaData);
	};

	// delete a media
	mediaFactory.delete = function(name) {
		return $http.delete('/api/media/' + name);
	};

	// return our entire mediaFactory object
	return mediaFactory;

});
