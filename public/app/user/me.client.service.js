'use strict';
angular.module('me.client.service', [])

//============================================
// Factory concerning the current user only,
// helps cut down the requests and simplifys
// the application. Downside is that this is
// is a bit harder to maintain
//============================================
.factory('Me', function($http) {

	// Create a new object
	var me = {};

    // Gets the current user and caches it
	me.get_cache = function(query) {
	    return $http({ url:'/api/me', method:'GET', params: query, cache: true });
	};

    // Gets the current user
	me.get = function(query) {
	    return $http({ url:'/api/me', method:'GET', params: query, cache: false });
	};

    // Update the current user
	me.update = function(user_data) {
		return $http({ url:'/api/me', method:'PUT', data: user_data});
	};

    // Pushes a general object into the current user for bulk additions
	me.push = function(capsule) {
	    return $http({ url:'/api/me', method:'POST', data: capsule});

        /*** Capusle Object
         *  ------------------------------------------------------------------------------
         *  'show_history'  : [{ show, date, seq  }]  -Tracks what show a user watched
         *  'media_history' : [{ show, date, prog }]  -Tracks what media a user watched
         *  'queue'         : [{ show, prio }]        -Shows the user plans to watch
         *   -----------------------------------------------------------------------------
         ***/
	};

    // Clears all saved data on user except username + password
	me.reset = function() {
		return $http({ url:'/api/me', method:'DELETE'});
	};

    //============================================
    // Show History
    //
    // pill : { show, date, seq }
    //  - show : show._id - The show watched
    //  - date : Date     - Date last watched
    //  - seq  : Number   - Episode Number
    //============================================

    // Gets array of show pills
    me.get_shows = function(query){
		return $http({ url:'/api/me/show-history', method:'GET', params: query});
    };

    // Pushes pill into media history or updates time if it already exists
    me.push_show = function(pill){
		return $httpt({ url:'/api/me/show-history', method:'POST', data: pill});
    };

    // Deletes show pill from history
    me.delete_show = function(show_name){
		return $http({ url:'/api/me/show-history' + show_name, method:'DELETE'});
    };

    //============================================
    // Media History
    //
    // pill : { media, date, prog }
    //  - media : media._id - The media watched
    //  - date  : Date      - Date last watched
    //  - prog  : Number    - Progress in seconds
    //============================================

    // Gets array of media pills
    me.get_media = function(query){
		return $http({ url:'/api/me/media-history', method:'GET', params: query});
    };

    // Pushes pill into media history or updates time if it already exists
    me.push_media = function(pill){
		return $http({ url:'/api/me/media-history', method:'POST', data: pill});
    };

    // Deletes media pill from history
    me.delete_media = function(media_name){
		return $http({ url:'/api/me/media-history' + media_name, method:'DELETE'});
    };

    //============================================
    // Show Queue
    //
    // pill : { show, prio }
    //  - show : show._id - The show planned
    //  - prio : Number   - Where on the queue
    //============================================

    // Gets array of queue pills
    me.get_queue = function(query){
		return $http({ url:'/api/me/queue', method:'GET', params: query });
    };

    // Pushes pill into our main queue
    me.push_queue = function(pill){
		return $http({ url:'/api/me/queue', method:'POST', data: pill});
    };

    // Deletes media pill from history
    me.delete_queue = function(show_name){
		return $http({ url:'/api/me/queue' + show_name, method:'DELETE'});
    };

    // return our entire current user object
	return me;

});
