'use strict';

angular.module('similarity')
  .controller('DbSimilarityController', ['$scope', '$stateParams', '$location', 'Utilities', 'Authentication', 'DbSimilarity', 
    function($scope, $stateParams, $location, Utilities, Authentication, DbSimilarity) {
        $scope.values = {};

        // Set up the options used for setting the type of an algorithm
        // This should be in a global somewhere...
        $scope.typeOptions = [{'name': 'Class'}, {'name': 'Executable'}];

        // Create new Category
        $scope.create = function() {
            console.log('className: ' , this.className);
            console.log('type: ' , this.type);
            // Create new object
            var dbSimilarity = new DbSimilarity.query ({
                className: this.className,
                type: this.type.name,
                description: this.description
            });

            console.log('dbSimilarity.className: ' , dbSimilarity.className);

            // Redirect after save
            dbSimilarity.$save(function(response) {
                $location.path('similarity');

                // Clear form fields
                $scope.className = '';
                $scope.type = '';
                $scope.description = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Category
        $scope.remove = function(dbSimilarity) {
            if ( dbSimilarity ) {
                dbSimilarity.$remove();

                for (var i in $scope.similarities) {
                    if ($scope.similarities [i] === dbSimilarity) {
                        $scope.similarities.splice(i, 1);
                    }
                }
            } else {
                $scope.similarity.$remove(function() {
                    $location.path('similarity');
                });
            }
        };

        // Update existing Similarity
        $scope.update = function() {
            console.log('$scope.similarity on update: ', $scope.similarity);
            var dbSimilarity = $scope.similarity;

             $scope.similarity.$save(function() {
              $location.path('similarity/' + dbSimilarity._id);
              $location.path('similarity');
          },function(errorResponse) {
              $scope.error = errorResponse.data.message;
          });
        };

        // Find a list of Similarity
        $scope.find = function() {
            console.log('in find: ' );
            $scope.similarities = DbSimilarity.query.query();
        };
        // Find existing Category
        $scope.findOne = function() {
            console.log('findOne for similarity: ' , $stateParams.similarityId);
            console.log('scope: ', $scope);
            $scope.similarity = DbSimilarity.get.query({
                similarityId: $stateParams.similarityId
            });
            console.log('scope.similarity: ', $scope.similarity);
        };

        $scope.execute = function(className, nameSpace, similarityDirectory) {
            console.log('className: ' , className);
            var lastDirCharacter = similarityDirectory.charAt(similarityDirectory.length - 1);
            if (lastDirCharacter !== '/') {
               similarityDirectory = similarityDirectory.concat('/');
            }
            var lastDot = className.lastIndexOf('.');
            var lastClass = className.slice(lastDot + 1);
            var outputDir = similarityDirectory.concat(nameSpace, '-', lastClass);
            var outputFile = Utilities.dateFileName(outputDir, '.net');
            $scope.outputFile = outputFile;
            console.log('outputFile: ' , outputFile);
            console.log('stateParams: ' , $stateParams);
           
            DbSimilarity.execute.query({
                similarityId: $stateParams.similarityId,
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
