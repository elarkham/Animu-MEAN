'use strict';
angular.module('show.client.service', [])

.factory('Show', function($http) {

	// create a new object
	var showFactory = {};

	// get a single show
	showFactory.get = function(name) {
		return $http.get('/api/shows/' + name);
	};

	// query for shows
	showFactory.all = function(query) {
		return $http({ url:'/api/shows/', method:'GET', params: query });

        /*** Query Object Fields
         *
         * 'tags[]'    : String  -All with Tag Group
         * 'excludes[]': String  -All without Tag Group
         * 'limit'     : Number  -How many to return
         * 'load'      : String  -How many fields to send back
         * 'sort'      : Number  -What field to sort the query by
         * 'order'     : String  -In Ascending or Descending order?
         *
         ****
        */
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
