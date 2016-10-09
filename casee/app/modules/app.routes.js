/**
 * Created by sajarora on 9/9/16.
 */
(function(){
  'use strict';

  angular.module('app').config(AppRoutes);


  AppRoutes.$inject = ['$urlRouterProvider', '$stateProvider'];
  function AppRoutes($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider.state('sidebar', {
      abstract: true,
      url: '',
      views: {
        navigation: {
          templateUrl: 'modules/layout/navbar.partial.html',
          controller: 'NavbarCtrl',
          controllerAs: 'ctrl'
        },
        content: {
          templateUrl: 'modules/layout/content-sidebar.partial.html'
        }
      }
    }).state('sidebar.dashboard', {
        url: '/dashboard',
        views: {
          sidebar: {
            templateUrl: 'modules/dashboard/sidebar.view.html',
            controller: 'SidebarCtrl',
            controllerAs: 'ctrl'
          },
          content: {
            templateUrl: 'modules/dashboard/dashboard.view.html',
            controller: 'DashboardCtrl',
            controllerAs: 'ctrl'
          }
        }
      }
    );
  }
})();
