'use strict';

//angular.module('core',['ngAnimate', 'ui.bootstrap']);
angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        $scope.mainImage = 'modules/core/img/brand/FullBridge.png';
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        var slides = $scope.slides = [];
        slides.push({text: 'Full Bridge', image: 'modules/core/img/brand/FullBridge.png'});
        slides.push({text: 'Selected DataSet', image: 'modules/core/img/brand/SelectedBridge.png'});
        slides.push({text: 'The DataSet', image: 'modules/core/img/brand/DataSet.png'});

        $scope.setActive = function(idx) {
           $scope.slides[idx].active=true;
        };
    }
]);
