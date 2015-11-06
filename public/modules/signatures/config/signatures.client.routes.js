'use strict';

//Setting up route
angular.module('signatures').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
        $stateProvider.
        state('listSignatures', {
            url: '/signatures',
            templateUrl: 'modules/signatures/views/signatures.client.list.view.html'
        }).
        state('createSignature', {
            url: '/signatures/create',
            templateUrl: 'modules/signatures/views/create-signatures.client.view.html'
        }).
        state('viewSignatures', {
            url: '/signatures/:signatureId',
            templateUrl: 'modules/signatures/views/view-signatures.client.view.html'
        }).
        state('launchSignatures', {
            url: '/signatures/:signatureId/launch',
            templateUrl: 'modules/signatures/views/launch-signatures.client.view.html'
        }).
        state('editSignatures', {
            url: '/signatures/:signaturesId/edit',
            templateUrl: 'modules/signatures/views/view-signatures.client.view.html'
        });
    }
]);
