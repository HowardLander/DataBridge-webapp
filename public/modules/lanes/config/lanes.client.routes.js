'use strict';

//Setting up route
angular.module('lanes').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
        $stateProvider.
        state('listLanes', {
            url: '/lanes',
            templateUrl: 'modules/lanes/views/lanes.client.list.view.html'
        }).
        state('createLane', {
            url: '/lanes/create',
            templateUrl: 'modules/lanes/views/create-lanes.client.view.html'
        }).
        state('viewLanes', {
            url: '/lanes/:laneId',
            templateUrl: 'modules/lanes/views/view-lanes.client.view.html'
        }).
        state('launchLanes', {
            url: '/lanes/:laneId/launch',
            templateUrl: 'modules/lanes/views/launch-lanes.client.view.html'
        }).
        state('editLanes', {
            url: '/lanes/:laneId/edit',
            templateUrl: 'modules/lanes/views/edit-lanes.client.view.html'
        });
    }
]);
