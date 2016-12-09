'use strict';

//Setting up route
angular.module('search').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
        $stateProvider.
        state('searchNetworks', {
            url: '/search',
            templateUrl: 'modules/search/views/search.client.list.view.html'
        });
    }
]);
