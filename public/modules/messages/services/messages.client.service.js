'use strict';

angular.module('messages').factory('DbMessages', ['$resource',
    function($resource) {
        return $resource('messages/:messageId', { messageId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
