'use strict';

//Setting up route
angular.module('messages').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
        $stateProvider.
        state('listMessages', {
            url: '/messages',
            templateUrl: 'modules/messages/views/messages.client.list.view.html'
        }).
        state('createMessage', {
            url: '/messages/create',
            templateUrl: 'modules/messages/views/create-messages.client.view.html'
        }).
        state('viewMessages', {
            url: '/messages/:messageId',
            templateUrl: 'modules/messages/views/view-messages.client.view.html'
        }).
        state('launchMessages', {
            url: '/messages/:messageId/launch',
            templateUrl: 'modules/messages/views/launch-messages.client.view.html'
        }).
        state('editMessages', {
            url: '/messages/:messageId/edit',
            templateUrl: 'modules/messages/views/edit-messages.client.view.html'
        });
    }
]);
