'use strict';

angular.module('search').factory('DbSearch', ['$resource',
    function($resource) {
        return {
           findNameSpaces: $resource('search', {  }, {
            query: { method: 'GET', isArray: true }
           }),
           findMetadata: $resource('search/metadata', {  }, {
            query: { method: 'GET', isArray: true }
           }),
           findAlgorithms: $resource('search/algorithms', {  }, {
            query: { method: 'GET', isArray: true }
           }),
           execute: $resource('search/launch', { }, {
            query: { method: 'GET' }
        })
    };
  }
]);

