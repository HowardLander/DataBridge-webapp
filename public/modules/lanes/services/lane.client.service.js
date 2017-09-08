'use strict';

angular.module('lanes').factory('DbLane', ['$resource',
    function($resource) {
        return {
           query: $resource('lanes', {  }, {
            query: { method: 'GET', isArray: true }
           }),
           get: $resource('lanes/:laneId', { laneId: '@_id' }, {
            query: { method: 'GET' }
           }),
           update: $resource('lanes/:laneId', { laneId: '@_id' }, {
            query: { method: 'PUT' }
           }),
           execute: $resource('lanes/:laneId/launch', { laneId: '@_id' }, {
            query: { method: 'GET' }
        })
    };
  }
]);
