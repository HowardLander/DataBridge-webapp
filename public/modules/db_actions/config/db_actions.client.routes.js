'use strict';

//Setting up route
angular.module('db_actions').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
        $stateProvider.
        state('listActions', {
            url: '/actions',
            templateUrl: 'modules/db_actions/views/db_actions.client.list.view.html'
        }).
        state('createAction', {
            url: '/actions/create',
            templateUrl: 'modules/db_actions/views/create-actions.client.view.html'
        }).
        state('viewActions', {
            url: '/actions/:actionsId',
            templateUrl: 'modules/db_actions/views/view-actions.client.view.html'
        }).
        state('editActions', {
            url: '/actions/:actionsId/edit',
            templateUrl: 'modules/db_actions/views/edit-actions.client.view.html'
        });
    }
]);
