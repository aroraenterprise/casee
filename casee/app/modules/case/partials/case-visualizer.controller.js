/**
 * Created by sajarora on 9/9/16.
 */
(function(){
    'use strict';

    angular.module('app').controller('CaseVisualizerCtrl', CaseCtrl);

    function CaseCtrl($log, $scope, $window, assetService, $timeout){
        var vm = this;
        vm.files = assetService.files;
        var color = d3.scale.category20c();

        $scope.options = {

            chart: {

                type: 'forceDirectedGraph',
                height: window.innerHeight,
                width: window.innerWidth,
                margin: {top: 20, right: 20, bottom: 20, left: 20},
                color: function (d) {
                    return color(d.group)
                },
                charge: function (d) {
                    return d.group * -150;
                },
                dispatch: {
                    elementClick: function (e) {
                        console.log('click')
                    },
                },
                nodes: {

                },
                forceX: 100,
                radius: 15,
                gravity: 0.05,
                nodeExtras: function (node) {
                    node && node
                        .append("text")
                        .attr("dx", 15)
                        .attr("dy", "1.5em")
                        .text(function (d) {
                            return d.title
                        })
                        .style('font-size', '15px');
                },
            },
        };



        angular.element($window).bind('resize', function(){
            $scope.options.chart.width = $window.innerWidth;
            $scope.options.chart.height = $window.innerHeight;
            // manuall $digest required as resize event
            // is outside of angular
            $scope.$digest();
        });

        $scope.data = {
            "nodes": vm.files,
            "links": assetService.links
        }
    }
})();