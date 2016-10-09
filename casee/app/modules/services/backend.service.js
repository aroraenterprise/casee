/**
 * Created by Saj Arora on 10/9/2016.
 */
/**
 * Created by sajarora on 7/1/16.
 */
(function() {
    'use strict';

    angular.module('app')
        .factory('backendService', BackendFactory);

    function BackendFactory($log, Restangular, $q) {
        var factory = {};
        factory.create = Create;
        factory.get = Get;
        factory.list = List;
        factory.restangular = Restangular;
        factory.reset = ResetStore;
        factory.search = Search;
        factory.store = {};
        Activate();

        return factory;

        ///functions
        function Activate(){

        }

        function Create(model, data){
            return factory.restangular.all(model).post(data);
        }

        function Get(model, key){
            if (key)
                return factory.restangular.one(model, key).get();
            else
                return factory.restangular.all(model).customGET();
        }

        function List(model, options, cursor){
            var _deferred = $q.defer();
            if (!factory.store[model] || options)
                factory.reset(model, options);

            if (factory.store[model].initializing) {
                _deferred.reject();
            } else {
                factory.store[model].initializing = true;
                if (factory.store[model].initialized && !factory.store[model].meta.more) {
                    $log.debug('initializing or no more items');
                    _deferred.reject();
                } else {
                    var promise = factory.restangular.all(model).getList(_.extend({
                        filter: factory.store[model].options ? factory.store[model].options.filters: null,
                        order: factory.store[model].options ? factory.store[model].options.order : null,
                        cursor: cursor || factory.store[model].meta.next_cursor
                    }, factory.store[model].options ? factory.store[model].options.opt : {}))
                        .then(function (response) {
                        angular.forEach(response, function (item) {
                            factory.store[model].items.push(item);
                        });

                        factory.store[model].meta = response.meta;
                        factory.store[model].cursors.push(response.meta.next_cursor);
                        factory.store[model].initialized = true;
                        factory.store[model].initializing = false;
                        _deferred.resolve(response);
                    }, function () {
                        factory.store[model].initialized = true;
                        factory.store[model].initializing = false;
                        _deferred.reject();
                    });
                }
            }
            return _deferred.promise;
        }

        function ResetStore(model, options){
            $log.debug('Reset store for: ' + model);
            if (!factory.store[model])
                factory.store[model] = {};

            factory.store[model].items = [];
            factory.store[model].meta = {};
            factory.store[model].options = options;
            factory.store[model].cursors = [];
            factory.store[model].initialized = false;
            factory.store[model].initializing = false;

            return factory.store[model];
        }

        function Search(query, type){
            var endpoint = 'search' + (type ? '/' + type : '');
            return factory.restangular.all(endpoint).getList({q:query});
        }
    }
})();