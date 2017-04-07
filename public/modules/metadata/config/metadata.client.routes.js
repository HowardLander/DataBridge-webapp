'use strict';

//Setting up route
angular.module('metadata').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
        $stateProvider.
        state('listMetadata', {
            url: '/metadata',
            templateUrl: 'modules/metadata/views/metadata.client.list.view.html'
        }).
        state('createMetadata', {
            url: '/metadata/create',
            templateUrl: 'modules/metadata/views/create-metadata.client.view.html'
        }).
        state('viewMetadata', {
            url: '/metadata/:metadataId',
            templateUrl: 'modules/metadata/views/view-metadata.client.view.html'
        }).
        state('launchMetadata', {
            url: '/metadata/:metadataId/launch',
            templateUrl: 'modules/metadata/views/launch-metadata.client.view.html'
        }).
        state('editMetadata', {
            url: '/metadata/:metadataId/edit',
            templateUrl: 'modules/metadata/views/edit-metadata.client.view.html'
        });
    }
]);
