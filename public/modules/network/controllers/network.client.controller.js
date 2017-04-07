'use strict';

angular.module('network')
  .controller('DbNetworkController', ['$scope', '$stateParams', '$location', 'Utilities', 'Authentication', 'DbNetwork', 
    function($scope, $stateParams, $location, Utilities, Authentication, DbNetwork) {
        $scope.values = {};

        // Create new Category
        $scope.create = function() {
            // Create new object
            var dbNetwork = new DbNetwork.query ({
                className: this.className,
                type: this.type,
                description: this.description
            });
            console.log('className: ' , this.className);
            console.log('type: ' , this.type);

            // Redirect after save
            dbNetwork.$save(function(response) {
                $location.path('network');

                // Clear form fields
                $scope.className = '';
                $scope.type = '';
                $scope.description = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Category
        $scope.remove = function(dbNetwork) {
            if ( dbNetwork ) {
                dbNetwork.$remove();

                for (var i in $scope.networks) {
                    if ($scope.networks [i] === dbNetwork) {
                        $scope.networks.splice(i, 1);
                    }
                }
            } else {
                $scope.network.$remove(function() {
                    $location.path('network');
                });
            }
        };

        // Update existing 
        $scope.update = function() {
            var dbNetwork = $scope.network;

            $scope.network.$save(function() {
                $location.path('network/' + dbNetwork._id);
                $location.path('network');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Signatures
        $scope.find = function() {
            console.log('in find: ' );
            $scope.networks = DbNetwork.query.query();
        };
        // Find existing Category
        $scope.findOne = function() {
            console.log('findOne: ' , $stateParams.networkId);
            $scope.network = DbNetwork.get.query({
                networkId: $stateParams.networkId
            });
            console.log('scope.network: ', $scope.network);
        };

        $scope.execute = function(className, nameSpace, similarityId, parameters) {
            console.log('className: ' , className);
            console.log('nameSpace: ' , nameSpace);
            console.log('similarityId: ' , similarityId);
            console.log('stateParams: ' , $stateParams);
           
            DbNetwork.execute.query({
                networkId: $stateParams.networkId,
                className: className,
                nameSpace: nameSpace,
                similarityId: similarityId,
                parameters: parameters
            });
        };
    }
]).service('Utilities', function() {

       this.dateFileName = function(prefix, postfix) {
          var d = new Date();
          var year = String(d.getFullYear());
          var month = ('0' + String(d.getMonth() + 1)).slice(-2);
          var date = ('0' + String(d.getDate())).slice(-2);
          var hours = ('0' + String(d.getHours())).slice(-2);
          var minutes = ('0' + String(d.getMinutes())).slice(-2);
          var seconds = ('0' + String(d.getSeconds())).slice(-2);
          var tmpName = prefix.concat('-',year,'-',month,'-',date,'-', hours, '-', minutes, '-', seconds, postfix);
          return tmpName;
    };
  });
