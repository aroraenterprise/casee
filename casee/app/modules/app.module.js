(function(){
    'use strict';

    /**
     * @ngdoc overview
     * @name Kiwi Studio
     * @description
     * # Kiwi Studio
     *
     * Main module of the application.
     */
    angular
        .module('app', [
            'ngAnimate',
            'ngAria',
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngSanitize',
            'ngTouch',
            'ui.router',
            'ngMaterial',
            'restangular',
            'mdPickers',
            'electangular',
            'ui.tree',
            'nvd3'
        ])
        .constant('_', _);
})();
