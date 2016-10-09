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
          templateUrl: 'modules/layout/content-sidebar.partial.html',
          controller: 'SidebarCtrl',
          controllerAs: 'ctrl'
        }
      }
    }).state('dashboard', {
      url: '/dashboard',
      views: {
        navigation: {
          templateUrl: 'modules/layout/navbar.partial.html',
          controller: 'NavbarCtrl',
          controllerAs: 'ctrl'
        },
        content: {
          templateUrl: 'modules/dashboard/dashboard.view.html',
          controller: 'DashboardCtrl',
          controllerAs: 'ctrl'
        }
      }
    }).state('sidebar.case', {
      url: '/case/:key',
      abstract: true,
      resolve: {
        caseData: GetCase
      },
      views: {
        sidebar: {
          templateUrl: 'modules/case/sidebar.view.html',
          controller: 'CaseSidebarCtrl',
          controllerAs: 'ctrl'
        },
        content: {
          templateUrl: 'modules/case/case.view.html',
          controller: 'CaseCtrl',
          controllerAs: 'ctrl'
        }
      }
    }).state('sidebar.case.explorer', {
      url: '/explorer',
      templateUrl: 'modules/case/partials/case-explorer.partial.html',
      controller: 'CaseExplorerCtrl',
      controllerAs: 'ctrl'
    }).state('sidebar.case.visualizer', {
      url: '/visualizer',
      templateUrl: 'modules/case/partials/case-visualizer.partial.html',
      controller: 'CaseExplorerCtrl',
      controllerAs: 'ctrl'
    }).state('sidebar.case.extensions', {
      url: '/extensions',
      templateUrl: 'modules/case/partials/case-extensions.partial.html',
      controller: 'CaseExplorerCtrl',
      controllerAs: 'ctrl'
    });
  }

  function GetCase($stateParams, $log, $q, caseService, assetService) {
    var _deferred = $q.defer();
    caseService.get($stateParams.key, true).then(function(data){
          assetService.reset(data);
          if (!assetService.assets.initialized) {
            assetService.sync(data.path).then(function(){
              $log.debug(assetService.assets);
            });
            assetService.list();
          }
          _deferred.resolve(data);
        }, function(){
          _deferred.resolve(false);
        }
    );
    return _deferred.promise;
  }
})();
