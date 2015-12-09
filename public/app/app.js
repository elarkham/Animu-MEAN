'use strict';
angular.module('animu', ['ngAnimate',
                        'ui.bootstrap',
                        'ngAria',
                        'ngMaterial',
                        'ngSanitize',
                        'angularUtils.directives.dirPagination',
                        'app.routes',

                        'com.2fdevs.videogular', //Videoangular
                        'com.2fdevs.videogular.plugins.controls',
                        'com.2fdevs.videogular.plugins.overlayplay',
                        'com.2fdevs.videogular.plugins.poster',

                        'auth.client.service', //My Controllers + Services
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
