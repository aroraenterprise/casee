/**
 * Created by Saj Arora on 10/9/2016.
 */
/**
 * Created by sajarora on 7/1/16.
 */
(function(){
    'use strict';

    angular.module('app')
        .run(SharedRun);

    function SharedRun($log, Restangular, $rootScope, $timeout){
        var loadingPromise;
        Restangular.addRequestInterceptor(RequestInterceptor);
        Restangular.addResponseInterceptor(EndLoadingResponseInterceptor);
        Restangular.addResponseInterceptor(ExtractResponseInterceptor);
        Restangular.setErrorInterceptor(ErrorInterceptor);

        ///functions
        function EndLoading() {
            $timeout.cancel(loadingPromise);
            $rootScope.isLoading = false;
        }

        function RequestInterceptor(element, operation) {
            // This is just convenient loading indicator, so we don't have to do it in every controller
            // separately. It's mainly used to disable submit buttons, when request is sent. There's also
            // added little delay so disabling buttons looks more smoothly
            loadingPromise = $timeout(function () {
                $rootScope.isLoading = true;
            }, 500);

            if (operation === 'remove') {
                return undefined;
            }
            return element;
        }

        function EndLoadingResponseInterceptor(data) {
            EndLoading();
            return data;
        }

        function ErrorInterceptor(res){
            EndLoading();
        }

        /**
         * This interceptor extracts meta data from list response
         * This meta data can be:
         *      cursor - ndb Cursor used for pagination
         *      totalCount - total count of items
         *      more - whether datastore contains more items, in terms of pagination
         */
        function ExtractResponseInterceptor(data, operation) {
            var extractedData;
            if (operation === 'getList') {
                extractedData = data.list;
                extractedData.meta = data.meta;
            } else {
                extractedData = data;
            }
            return extractedData;
        }
    }
})();