'use strict';

angular.module('signatures')
  .controller('DbSignaturesController', ['$scope', '$stateParams', '$location', 'Utilities', 'Authentication', 'DbSignatures', 'DbNameSpaces',
    function($scope, $stateParams, $location, Utilities, Authentication, DbSignature, DbNameSpaces) {
        $scope.values = {};

        // Set up the options used for setting the type of an algorithm
        // This should be in a global somewhere...
        $scope.typeOptions = [{'name': 'Class'}, {'name': 'Executable'}];

        // Create new Category
        $scope.create = function() {
            // Create new object
            var dbSignature = new DbSignature.query ({
                className: this.className,
                type: this.type.name,
                description: this.description
            });
            console.log('className: ' , this.className);
            console.log('type: ' , this.type);

            // Redirect after save
            dbSignature.$save(function(response) {
                $location.path('signatures');

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
            console.log('$scope on update: ', $scope);
            var dbSignature = $scope.signature;

            $scope.signature.$save(function() {
                $location.path('signatures/' + dbSignature._id);
                $location.path('signatures');
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

       // Get a list of name spaces
        $scope.findNamespaces = function() {
            console.log('in findNameSpaces: ');
            if (typeof($scope.nameSpaces) === 'undefined') {
               $scope.nameSpaces = DbNameSpaces.query.query();
            }
            console.log('nameSpaces: ', $scope.nameSpaces);
        };

        $scope.execute = function(className, sourceNameSpace, targetNameSpace, parameters) {
            console.log('className: ' , className);
            console.log('sourceNameSpace: ' , sourceNameSpace);
            console.log('targetNameSpace: ' , targetNameSpace);
            console.log('stateParams: ' , $stateParams);
           
            DbSignature.execute.query({
                className: className,
                sourceNameSpace: sourceNameSpace.nameSpace,
                targetNameSpace: targetNameSpace.nameSpace,
                parameters: parameters
            }, function(results){
               const jsonResults = JSON.parse(results.content);
                $scope.submitted = true;
                console.log('high level results: ', results);
                console.log('results struct ', results.content);
                console.log('results are: ', jsonResults.results);
                console.log('status is: ', jsonResults.status);
                $scope.status = jsonResults.status;
                $scope.results = jsonResults.results;
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
