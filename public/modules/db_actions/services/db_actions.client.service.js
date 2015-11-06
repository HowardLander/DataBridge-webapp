'use strict';

angular.module('db_actions').factory('DbActions', ['$resource',
    function($resource) {
        return $resource('actions/:actionId', { actionId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
