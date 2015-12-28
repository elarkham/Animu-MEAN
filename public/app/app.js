'use strict';
// Defines the application and its dependencies
angular.module('animu', [
                        'ngAnimate',    // Fancy Animations
                        'ngAria',       // Accessibility support
                        'ui.bootstrap', // Twitter Bootstrap for Angular
                        'ngMaterial',   // Angular Material
                        'ngSanitize',   // Sanitizes foreign URLs for use in video player
                        'app.routes',   // Handles to URN routes to all pages in the app

                        // Pagnintation directive I found online
                        'angularUtils.directives.dirPagination',

                        // Video Player Plugins
                        'com.2fdevs.videogular',
                        'com.2fdevs.videogular.plugins.controls',
                        'com.2fdevs.videogular.plugins.overlayplay',
                        'com.2fdevs.videogular.plugins.poster',
                        'com.benjipott.videogular.plugins.chromecast',

                        'interceptor.client.service', // Intercepts HTTP requests and adds Token
                        'main.client.controller',     // Makes sure the User is logged in

                        'user.client.service',        // Handles all interactions with User models
                        'user.client.controller',     // Handles all client logic for User models

                        'show.client.service',        // Handles all interactions with Show models
                        'show.client.controller',     // Handles all client logic for Show models

                        'media.client.service',       // Handles all interactions with Media models
                        'media.client.controller'     // Handles all client logic for Media models
                        ])

.config(function($httpProvider) {

    // Attaches the interceptor to all HTTP requests
	$httpProvider.interceptors.push('AuthInterceptor');

});
