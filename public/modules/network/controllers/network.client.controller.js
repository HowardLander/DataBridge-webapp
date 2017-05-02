'use strict';

angular.module('network')
  .controller('DbNetworkController', ['$scope', '$stateParams', '$location', 'Utilities', 'Authentication', 'DbNetwork', 'DbNameSpaces', 'DbSearch',
    function($scope, $stateParams, $location, Utilities, Authentication, DbNetwork, DbNameSpaces, DbSearch) {
        $scope.values = {};
        $scope.checkedMetadata = [];
        $scope.checkedMetadataNames = [];
        $scope.algorithms = [];
        $scope.simInstances = [];
        $scope.algorithm = '';
        $scope.returnedData = '';
        $scope.selectedSimId = {};
        $scope.results = {};
        $scope.status = {};
        $scope.results = {};
        $scope.submitted = false;

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

        // Get a list of name spaces
        $scope.findNamespaces = function() {
            console.log('in findNameSpaces: ');
            $scope.nameSpaces = DbNameSpaces.query.query();
            console.log('nameSpaces: ', $scope.nameSpaces);
            //$scope.nameSpaces = DbSearch.findNameSpaces.query({thisSearch: thisSearch});
        };

        // Get a list of metadata fields that have been used for similarity analysis in the
        // specified nameSpace
        $scope.findMetadata = function(nameSpace) {
            console.log('in findMetadata: ');
            $scope.nameSpace = nameSpace;
            $scope.metadata = DbSearch.findMetadata.query({nameSpace: nameSpace});
            //$scope.nameSpaces = DbSearch.findNameSpaces.query({thisSearch: thisSearch});
        };

        // Find a list of similarity algorithms that have been run for the specifed combination
        // of metadata fields (in the params variable) and nameSpace 
        $scope.findAlgorithms = function(params, index, checked) {
            console.log('in findAlgorithms: ', $scope.nameSpace, ' ',  params);
            console.log('thisIndex: ', index);
            console.log('value: ', checked);
            if (checked === 1) {
               $scope.algorithms[index] =
                  DbSearch.findAlgorithms.query({nameSpace: $scope.nameSpace, params: params});
               console.log('algorithm list: ', $scope.algorithms[index]);
               $scope.checkedMetadata[index] = 1;
               $scope.checkedMetadataNames[index] = params;
            } else {
               $scope.algorithms[index] = '';
               $scope.checkedMetadata[index] = 0;
            }
        };

        // Find a list of similarity instances that have been run for the specifed combination
        // of metadata fields (in the params variable) nameSpace, and algorithm
        $scope.findSimilarityInstances = function(params, index, checked, algorithm) {
            console.log('in findSimilarityInstances: ', $scope.nameSpace, ' ',  checked);
            console.log('params: ', params);
            console.log('index: ', index);
            console.log('checked: ', checked);
            console.log('algorithm: ', algorithm);
            $scope.algorithm = algorithm;
        //    if (checked === 1) {
               $scope.simInstances[index] =
                  DbSearch.findInstances.query({className: algorithm, nameSpace: $scope.nameSpace, params: params});
               console.log('simInstance list: ', $scope.simInstances[index]);
         //   } else {
          //     $scope.simInstances[index] = '';
           // }
        };


        $scope.execute = function(nameSpace, parameters) {
            console.log('className: ' , $scope.algorithm);
            console.log('network className: ' , $scope.network.className);
            console.log('class type: ' , $scope.network.type);
            console.log('nameSpace: ' , nameSpace);
            console.log('Id: ' , $scope.selectedSimId._id);

            if (typeof parameters === 'undefined') {
               parameters='';
            }

            console.log('parameters: ' , parameters);
           
            DbNetwork.execute.query({
                parameters: parameters,
                className: $scope.network.className,
                type: $scope.network.type,
                nameSpace: nameSpace,
                similarityId: $scope.selectedSimId._id
            }, function(results) {
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
