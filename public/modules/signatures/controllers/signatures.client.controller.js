'use strict';

angular.module('signatures')
  .controller('DbSignaturesController', ['$scope', '$stateParams', '$location', 'Authentication', 'DbSignatures', 
    function($scope, $stateParams, $location, Authentication, DbSignature) {
        $scope.values = {};

        // Create new Category
        $scope.create = function() {
            // Create new object
            var dbSignature = new DbSignature ({
                className: this.className,
                type: this.type,
                description: this.description
            });
            console.log('className: ' , this.className);
            console.log('type: ' , this.type);

            // Redirect after save
            dbSignature.$save(function(response) {
                $location.path('signatures/create' + response._id);

                // Clear form fields
                $scope.className = '';
                $scope.type = '';
                $scope.description = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Category
        $scope.remove = function(dbSignature) {
            if ( dbSignature ) {
                dbSignature.$remove();

                for (var i in $scope.signatures) {
                    if ($scope.signatures [i] === dbSignature) {
                        $scope.signatures.splice(i, 1);
                    }
                }
            } else {
                $scope.signature.$remove(function() {
                    $location.path('signatures');
                });
            }
        };

        // Update existing Signature
        $scope.update = function() {
            var dbSignature = $scope.signature;

            dbSignature.$update(function() {
                $location.path('signatures/' + dbSignature._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Signatures
        $scope.find = function() {
            console.log('in find: ' );
            $scope.signatures = DbSignature.query.query();
        };
        // Find existing Category
        $scope.findOne = function() {
            console.log('findOne: ' , $stateParams.signatureId);
            $scope.signature = DbSignature.get.query({
                signatureId: $stateParams.signatureId
            });
            console.log('scope.signature: ', $scope.signature);
        };

        $scope.execute = function(className, nameSpace, outputFile) {
            console.log('className: ' , className);

            DbSignature.execute.query({
                signatureId: $stateParams.signatureId,
                className: className,
                nameSpace: nameSpace,
                outputFile: outputFile
            });
        };
    }
]);
