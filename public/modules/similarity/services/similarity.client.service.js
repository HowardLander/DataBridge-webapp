'use strict';

angular.module('similarity').factory('DbSimilarity', ['$resource',
    function($resource) {
        return {
           query: $resource('similarity', {  }, {
            query: { method: 'GET', isArray: true }
           }),
           save: $resource('similarity/create', {  }, {
            query: { method: 'POST', isArray: true }
           }),
           get: $resource('similarity/:similarityId', { similarityId: '@_id' }, {
            query: { method: 'GET' }
           }),
           update: $resource('similarity/:similarityId', { similarityId: '@_id' }, {
            query: { method: 'PUT' }
           }),
           execute: $resource('similarity/:similarityId/launch', { similarityId: '@_id' }, {
            query: { method: 'PUT' }
        })
    };
  }
]);

