'use strict';
angular.module('animu', ['ngAnimate',
                        'ui.bootstrap',
                        'app.routes',
                        'auth.client.service',
                        'main.client.controller',
                        'user.client.service',
                        'user.client.controller',
                        'show.client.service',
                        'show.client.controller',
                        'media.client.service',
                        'media.client.controller'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});
