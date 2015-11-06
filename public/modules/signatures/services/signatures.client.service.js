'use strict';

angular.module('signatures').factory('DbSignatures', ['$resource',
    function($resource) {
        return {
           query: $resource('signatures', {  }, {
            query: { method: 'GET', isArray: true }
           }),
           get: $resource('signatures/:signatureId', { signatureId: '@_id' }, {
            query: { method: 'GET' }
           }),
           update: $resource('signatures/:signatureId', { signatureId: '@_id' }, {
            query: { method: 'PUT' }
           }),
           execute: $resource('signatures/:signatureId/launch', { signatureId: '@_id' }, {
            query: { method: 'PUT' }
        })
    };
  }
]);

