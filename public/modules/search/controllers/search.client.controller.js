'use strict';

angular.module('search')
  .controller('DbSearchController', ['$scope', '$stateParams', '$location', 'Utilities', 'Authentication', 'DbSearch', 
    function($scope, $stateParams, $location, Utilities, Authentication, DbSearch) {
        $scope.values = {};
        $scope.checkedMetadata = [];
        $scope.checkedMetadataNames = [];
        $scope.algorithms = [];
        $scope.showResults = false;
        $scope.nMatches = 10;
        var checkedAlgorithms = new Set();

        // Find a list of relevant nameSpaces
        $scope.findNameSpaces = function(thisSearch) {
            console.log('in findNameSpaces: ' + thisSearch);
            $scope.nameSpaces = DbSearch.findNameSpaces.query({thisSearch: thisSearch});
        };

        // Find a list of relevant metadata
        $scope.populate = function() {
            console.log('in populate: ');
        };

        // Find a list of relevant metadata
        $scope.findMetadata = function(nameSpace) {
            console.log('in findMetadata: ' + nameSpace);
            $scope.nameSpace = nameSpace;
            $scope.metadata = DbSearch.findMetadata.query({nameSpace: nameSpace});
        };

        // Find a list of relevant metadata
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
        
        $scope.execute = function(searchURL, nameSpace) {
           var params;
           var algorithm;
           console.log('searchURL: ', searchURL);
           console.log('nameSpace: ', nameSpace);
           if (checkedAlgorithms.size === 0) {
              alert('Nothing to submit');
              return;
           } else {
              // We are only supporting single search at the moment, but it won't be hard to upgrade
              // Get the first item form the set
              var iter = checkedAlgorithms.values();
              var first = iter.next().value;
              var results = first.split('-');
              params = results[0]; 
              algorithm = results[1]; 
              console.log('params: ', params);
              console.log('algorithm: ', algorithm);
              console.log('nMatches: ', $scope.nMatches);
           }
           DbSearch.execute.query({searchURL: searchURL, nameSpace: nameSpace, 
                            params: params, algorithm: algorithm, nMatches: $scope.nMatches}, 
             function(results){
                const jsonResults = results.content.toString();
                $scope.showResults = true;
                $scope.returnedData = JSON.parse(results.content);
             });
        };

        // This function is used to keep track of which of the algorithms
        // are currently selected in the interface.  This is because at some
        // point we may want to allow the user to specify a search that includes
        // more than one specification.
        $scope.addToClicks = function(checked, metadata, algorithm){
                 console.log('checked is: ', checked);
                 console.log('metadata is: ', metadata);
                 console.log('algorithm is: ', algorithm);
                 var name = metadata + '-' + algorithm;
                 console.log('name is: ', name);
                 if (checked === 1) {
                    // add to the set
                    checkedAlgorithms.add(name);
                 } else {
                    // remove from set
                    checkedAlgorithms.delete(name);
                 }
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
