'use strict';

angular.module('namespaces' )
  .controller('DbNameSpacesController', ['$scope', '$rootScope', '$localStorage', '$stateParams', '$location', 'Utilities', 'Authentication', 'DbNameSpaces', 
    function($scope, $rootScope, $localStorage, $stateParams, $location, Utilities, Authentication, DbNameSpaces) {
        $scope.values = {};
        $scope.nameSpace = '';
        $scope.description = '';

        // Create new Category
        $scope.create = function() {
            // Create new object
            console.log('starting create namespace');
            var dbNameSpace = new DbNameSpaces.query ({
                nameSpace: this.nameSpace,
                description: this.description
            });
            console.log('nameSpace: ' , this.nameSpace);
            console.log('description: ' , this.description);

            // Redirect after save
            dbNameSpace.$save(function(response) {
                $location.path('namespaces');

                // Clear form fields
                $scope.nameSpace = '';
                $scope.description = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Category
        $scope.remove = function(dbNameSpace) {
            if ( dbNameSpace ) {
                dbNameSpace.$remove();

                for (var i in $scope.namespaces) {
                    if ($scope.namespaces [i] === dbNameSpace) {
                        $scope.namespaces.splice(i, 1);
                    }
                }
            } else {
                $scope.namespace.$remove(function() {
                    $location.path('namespaces');
                });
            }
        };

        $scope.update = function() {
          console.log('$scope.namespace on update: ', $scope.namespace);
          var dbNameSpace = $scope.namespace;
          $scope.namespace.$save(function() {
              $location.path('namespaces/' + dbNameSpace._id);
              $location.path('namespaces');
          },function(errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };
        // Find a list of NameSpaces
        $scope.find = function() {
            console.log('in find: ' );
            $scope.namespaces = DbNameSpaces.query.query();
            console.log('namespace: ', $scope.namespaces );
        };

        $scope.findOne = function() {
            console.log('starting findOne: ' , $stateParams);
            console.log('nameSpace: ' , $stateParams);
            console.log('nameSpace: ' , $stateParams.namespaceId);
            $scope.namespace = DbNameSpaces.get.query({
                namespaceId: $stateParams.namespaceId
            });
            console.log('scope.namespace: ', $scope.namespace);
        };
    }
]).filter('dateFromObjectId', function() {

   return function (objectId) {
          var  newVal = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
          return newVal.toString();
      };
    });
//  });
