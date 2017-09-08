'use strict';

angular.module('metadata')
  .controller('DbMetadataController', ['$scope', '$stateParams', '$location', 'Utilities', 'Authentication', 'DbMetadata', 'DbNameSpaces',
    function($scope, $stateParams, $location, Utilities, Authentication, DbMetadata, DbNameSpaces) {
        $scope.values = {};

        // Set up the options used for setting the type of an algorithm
        // This should be in a global somewhere...
        $scope.typeOptions = [{'name': 'Class'}, {'name': 'Executable'}];

        // Create new Category
        $scope.create = function() {
            // Create new object
            var dbMetadata = new DbMetadata.query ({
                className: this.className,
                type: this.type.name,
                description: this.description
            });
            console.log('className: ' , this.className);
            console.log('type: ' , this.type);

            // Redirect after save
            dbMetadata.$save(function(response) {
                $location.path('metadata');

                // Clear form fields
                $scope.className = '';
                $scope.type = '';
                $scope.description = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Category
        $scope.remove = function(dbMetadata) {
            if ( dbMetadata ) {
                dbMetadata.$remove();

                for (var i in $scope.metadatas) {
                    if ($scope.metadatas [i] === dbMetadata) {
                        $scope.metadatas.splice(i, 1);
                    }
                }
            } else {
                $scope.metadata.$remove(function() {
                    $location.path('metadata');
                });
            }
        };

        // Update existing 
        $scope.update = function() {
            var dbMetadata = $scope.metadata;

            $scope.metadata.$save(function() {
                $location.path('metadata/' + dbMetadata._id);
                $location.path('metadata');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Signatures
        $scope.find = function() {
            console.log('in find: ' );
            $scope.metadatas = DbMetadata.query.query();
        };
        // Find existing Category
        $scope.findOne = function() {
            console.log('findOne: ' , $stateParams.metadataId);
            $scope.metadata = DbMetadata.get.query({
                metadataId: $stateParams.metadataId
            });
            console.log('scope.metadata: ', $scope.metadata);
        };

       // Get a list of name spaces
        $scope.findNamespaces = function() {
            console.log('in findNameSpaces: ');
            $scope.nameSpaces = DbNameSpaces.query.query();
            console.log('nameSpaces: ', $scope.nameSpaces);
        };

        $scope.execute = function(nameSpace, className, input, parameters) {
            console.log('nameSpace: ' , nameSpace);
            console.log('className: ' , className);
            console.log('input: ' , input);
            if (typeof(parameters) === 'undefined') {
               parameters ='';
            }
            console.log('parameters: ' , parameters);
           
            DbMetadata.execute.query({
                nameSpace: nameSpace,
                className: className,
                input: input,
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
