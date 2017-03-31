'use strict';

//Setting up route
angular.module('namespaces').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
        $stateProvider.
        state('listNamespaces', {
            url: '/namespaces',
            templateUrl: 'modules/namespace/views/namespaces.client.list.view.html'
        }).
        state('createNamespace', {
            url: '/namespaces/create',
            templateUrl: 'modules/namespace/views/create-namespaces.client.view.html'
        }).
        state('viewNamespace', {
            url: '/namespaces/:namespaceId',
            templateUrl: 'modules/namespace/views/view-namespaces.client.view.html'
        }).
        state('editNamespace', {
            url: '/namespaces/:namespaceId/edit',
            templateUrl: 'modules/namespace/views/edit-namespaces.client.view.html'
        });
    }
]);
