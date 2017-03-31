'use strict';

angular.module('namespaces').factory('DbNameSpaces', ['$resource',
    function($resource) {
        return {
           query: $resource('namespaces', {  }, {
            query: { method: 'GET', isArray: true }
           }),
           get: $resource('namespaces/:namespaceId', { namespaceId: '@_id' }, {
            query: { method: 'GET' }
           }),
           update: $resource('namespaces/:namespaceId/update', { namespaceId: '@_id' }, {
            query: { method: 'PUT' }
           })
    };
  }
]);

