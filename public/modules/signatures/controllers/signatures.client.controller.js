'use strict';

angular.module('signatures')
  .controller('DbSignaturesController', ['$scope', '$stateParams', '$location', 'Utilities', 'Authentication', 'DbSignatures', 
    function($scope, $stateParams, $location, Utilities, Authentication, DbSignature) {
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

        $scope.execute = function(className, nameSpace, signatureDirectory) {
            console.log('className: ' , className);
            var lastDirCharacter = signatureDirectory.charAt(signatureDirectory.length - 1);
            if (lastDirCharacter !== '/') {
               signatureDirectory = signatureDirectory.concat('/');
            }
            var lastDot = className.lastIndexOf('.');
            var lastClass = className.slice(lastDot + 1);
            var outputDir = signatureDirectory.concat(nameSpace, '-', lastClass);
            var outputFile = Utilities.dateFileName(outputDir, '.net');
            $scope.outputFile = outputFile;
            console.log('outputFile: ' , outputFile);
            console.log('stateParams: ' , $stateParams);
           
            DbSignature.execute.query({
                signatureId: $stateParams.signatureId,
                className: className,
                nameSpace: nameSpace,
                outputFile: outputFile
            });

            return outputFile;
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
