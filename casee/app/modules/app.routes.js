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
    }).state('sidebar.dashboard', {
          url: '/dashboard',
          views: {
            sidebar: {
              templateUrl: 'modules/dashboard/sidebar.view.html',
              controller: 'DashboardSidebarCtrl',
              controllerAs: 'ctrl'
            },
            content: {
              templateUrl: 'modules/dashboard/dashboard.view.html',
              controller: 'DashboardCtrl',
              controllerAs: 'ctrl'
            }
          }
        }
    ).state('sidebar.case', {
      url: '/case/:key',
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
