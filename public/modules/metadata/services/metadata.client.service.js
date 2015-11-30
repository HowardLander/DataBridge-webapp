'use strict';

angular.module('metadata').factory('DbMetadata', ['$resource',
    function($resource) {
        return {
           query: $resource('metadata', {  }, {
            query: { method: 'GET', isArray: true }
           }),
           get: $resource('metadata/:metadataId', { metadataId: '@_id' }, {
            query: { method: 'GET' }
           }),
           update: $resource('metadata/:metadataId', { metadataId: '@_id' }, {
            query: { method: 'PUT' }
           }),
           execute: $resource('metadata/:metadataId/launch', { metadataId: '@_id' }, {
            query: { method: 'PUT' }
        })
    };
  }
]);

