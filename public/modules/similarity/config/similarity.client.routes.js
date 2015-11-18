'use strict';

//Setting up route
angular.module('similarity').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
        $stateProvider.
        state('listSimilarity', {
            url: '/similarity',
            templateUrl: 'modules/similarity/views/similarity.client.list.view.html'
        }).
        state('createSimilarity', {
            url: '/similarity/create',
            templateUrl: 'modules/similarity/views/create-similarity.client.view.html'
        }).
        state('viewSimilarities', {
            url: '/similarity/:similarityId',
            templateUrl: 'modules/similarity/views/view-similarity.client.view.html'
        }).
        state('launchSimilarities', {
            url: '/similarity/:similarityId/launch',
            templateUrl: 'modules/similarity/views/launch-similarity.client.view.html'
        }).
        state('editSimilarities', {
            url: '/similarity/:similaritysId/edit',
            templateUrl: 'modules/similarity/views/view-similarity.client.view.html'
        });
    }
]);
