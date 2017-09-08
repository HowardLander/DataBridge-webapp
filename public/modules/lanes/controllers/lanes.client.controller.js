'use strict';

angular.module('lanes')
  .controller('DbLanesController', ['$scope', '$stateParams', '$location', 'Authentication', 'DbLane', 'DbMetadata', 'DbSignatures', 'DbSimilarity', 'DbNetwork',
    function($scope, $stateParams, $location, Authentication, DbLane, DbMetadata, DbSignatures, DbSimilarity, DbNetwork) {
        $scope.authentication = Authentication;

        $scope.lane = '';
        console.log('authentication: ', $scope.authentication);
        $scope.makeNewHeader = function(key, value, header) {
           var newHeader = {};
           if (typeof(key) === 'undefined') {
              // use the key from the existing header
              key = $scope.headerKey(header);
           }
           if (typeof(value) === 'undefined') {
              // use the key from the existing header
              value = $scope.headerValue(header);
           }
           newHeader[key] = value;
           var stringified = JSON.stringify(newHeader);
           var parsed = JSON.parse(stringified);
           return parsed;
        };
        // Create new lane
        $scope.create = function() {
            console.log('starting create lane');
            var ingestImpl = '';
            var signatureImpl = '';
            var similarityImpl = '';
            var SNAImpl = '';
            // Create new object
            if (typeof(this.ingestExe) !== 'undefined') {
               ingestImpl = this.ingestExe.className;
            } 
            if (typeof(this.signatureExe) !== 'undefined') {
                signatureImpl = this.signatureExe.className;
            } 
            if (typeof(this.similarityExe) !== 'undefined') {
                similarityImpl = this.similarityExe.className;
            } 
            if (typeof(this.SNAExe) !== 'undefined') {
                SNAImpl = this.SNAExe.className;
            } 
            var dbLane = new DbLane.query ({
                name: this.laneName,
                description: this.description,
                creatorId: $scope.authentication.user._id,
                nameSpace: this.nameSpace,
                ingestImpl: ingestImpl,
                ingestParams: this.ingestParams,
                signatureImpl: signatureImpl,
                signatureParams: this.signatureParams,
                similarityImpl: similarityImpl,
                similarityParams: this.similarityParams,
                SNAImpl: SNAImpl,
                SNAParams: this.SNAParams
            });

            // Redirect after save
            dbLane.$save(function(response) {
                $location.path('lanes');

                // Clear form fields
                $scope.currentMessage = '';
                $scope.nameSpace = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Metadata algorithms
        $scope.findIngest = function() {
            console.log('in find ingest: ' );
            $scope.ingestImpls = DbMetadata.query.query();
            console.log('ingestImpls:' , $scope.ingestImpls);
        };

        // Find a list of Signature algorithms
        $scope.findSignatures = function() {
            console.log('in find signature: ' );
            $scope.signatureImpls = DbSignatures.query.query();
            console.log('signatureImpls:' , $scope.signatureImpls);
        };

        // Find a list of Similarity algorithms
        $scope.findSimilarities = function() {
            console.log('in find similarities: ' );
            $scope.similarityImpls = DbSimilarity.query.query();
            console.log('similarityImpls:' , $scope.similarityImpls);
        };

        // Find a list of SNA algorithms
        $scope.findSNA = function() {
            console.log('in find SNA: ' );
            $scope.SNAImpls = DbNetwork.query.query();
            console.log('SNAImpls:' , $scope.SNAImpls);
        };

        // Remove existing Category
        $scope.remove = function(dbLane) {
            if ( dbLane ) {
                dbLane.$remove();

                for (var i in $scope.actions) {
                    if ($scope.actions [i] === dbLane) {
                        $scope.actions.splice(i, 1);
                    }
                }
            } else {
                $scope.action.$remove(function() {
                    $location.path('actions');
                });
            }
        };

        // Update existing Lane
        $scope.update = function() {
            console.log('$scope.lane on update: ', JSON.stringify($scope.lane));
            console.log('$scope.lane on update: ', $scope.lane);
            var DbLane = $scope.lane;
            $scope.lane.$save(function() {
                $location.path('lanes/' + $scope.lane._id);
                $location.path('lanes');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                console.log('error in lane update: ', errorResponse.data.message);
            });
        };

        $scope.headerKey = function(theHeader) {
             if ('undefined' === typeof theHeader) {
                return null;
             }
             var key = Object.keys(theHeader);
             return key;
          };

        $scope.headerValue = function(theHeader) {
             if ('undefined' === typeof theHeader) {
                return null;
             }
             var key = Object.keys(theHeader);
             var value = theHeader[key];
             return value;
          };


        // Find a list of lanes
        $scope.find = function() {
            console.log('in find for lanes: ' );
            console.log('typeOptions: ', $scope.typeOptions);
            $scope.lanes = DbLane.query.query();
        };

        // Find existing Category
        $scope.findOne = function() {
            console.log('in findOne for lanes for lane: ', $stateParams.laneId );
            $scope.lane = DbLane.get.query({
                laneId: $stateParams.laneId
            });
            console.log('returned lane: ', $scope.lane );
        };
    }
]).filter('headerKey', function() {
         return function(theHeader) {
             if ('undefined' === typeof theHeader) {
                return null; 
             }
             var key = Object.keys(theHeader)[0];
             var value = theHeader[key];
             return key;
          };
}).filter('valueKey', function() {
         return function(theHeader) {
             if ('undefined' === typeof theHeader) {
                return null; 
             }
             var key = Object.keys(theHeader)[0];
             var value = theHeader[key];
             return value;
          };
       });
