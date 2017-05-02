'use strict';

angular.module('network').factory('DbNetwork', ['$resource',
    function($resource) {
        return {
           query: $resource('network', {  }, {
            query: { method: 'GET', isArray: true }
           }),
           get: $resource('network/:networkId', { networkId: '@_id' }, {
            query: { method: 'GET' }
           }),
           update: $resource('network/:networkId', { networkId: '@_id' }, {
            query: { method: 'PUT' }
           }),
           execute: $resource('network/:networkId/launch', { networkId: '@_id' }, {
            query: { method: 'GET' }
        })
    };
  }
]);

