'use strict';

//Setting up route
angular.module('network').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
        $stateProvider.
        state('listNetwork', {
            url: '/network',
            templateUrl: 'modules/network/views/network.client.list.view.html'
        }).
        state('createNetwork', {
            url: '/network/create',
            templateUrl: 'modules/network/views/create-network.client.view.html'
        }).
        state('viewNetwork', {
            url: '/network/:networkId',
            templateUrl: 'modules/network/views/view-network.client.view.html'
        }).
        state('launchNetwork', {
            url: '/network/:networkId/launch',
            templateUrl: 'modules/network/views/launch-network.client.view.html'
        }).
        state('editNetwork', {
            url: '/network/:networkId/edit',
            templateUrl: 'modules/network/views/edit-network.client.view.html'
        });
    }
]);
