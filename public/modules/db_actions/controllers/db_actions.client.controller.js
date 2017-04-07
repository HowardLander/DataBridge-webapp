'use strict';

angular.module('db_actions')
  .controller('DbActionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'DbActions', 
    function($scope, $stateParams, $location, Authentication, DbAction) {
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
        // Create new Category
        $scope.create = function() {
            // Create new object
            var dbAction = new DbAction ({
                currentMessage: this.currentMessage,
                nameSpace: this.nameSpace
            });

           var headers = {};
           var headers2= {};
           var headers3= {};
           headers[this.header1Key] = this.header1Value;
           headers2[this.header2Key] = this.header2Value;
           headers3[this.header3Key] = this.header3Value;
         
           var stringified = JSON.stringify(headers);
           var parsed = JSON.parse(stringified);
         
           var stringified2 = JSON.stringify(headers2);
           var parsed2 = JSON.parse(stringified2);

           var stringified3 = JSON.stringify(headers3);
           var parsed3 = JSON.parse(stringified3);

           dbAction.headers = {};
           dbAction.headers[0] = parsed;
           dbAction.headers[1] = parsed2;
           dbAction.headers[2] = parsed3;
 

            // Redirect after save
            dbAction.$save(function(response) {
                $location.path('actions');

                // Clear form fields
                $scope.currentMessage = '';
                $scope.nameSpace = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Category
        $scope.remove = function(dbAction) {
            if ( dbAction ) {
                dbAction.$remove();

                for (var i in $scope.actions) {
                    if ($scope.actions [i] === dbAction) {
                        $scope.actions.splice(i, 1);
                    }
                }
            } else {
                $scope.action.$remove(function() {
                    $location.path('actions');
                });
            }
        };

        // Update existing Category
        $scope.update = function() {
            var dbAction = $scope.action;
            var header0 = $scope.makeNewHeader($scope.action.header1Key, 
                                               $scope.action.header1Value, 
                                               $scope.action.headers[0]);
            var header1 = $scope.makeNewHeader($scope.action.header2Key, 
                                               $scope.action.header2Value, 
                                               $scope.action.headers[1]);
            var header2 = $scope.makeNewHeader($scope.action.header3Key, 
                                               $scope.action.header3Value, 
                                               $scope.action.headers[2]);
            dbAction.headers[0] = header0;
            dbAction.headers[1] = header1;
            dbAction.headers[2] = header2;

            dbAction.$save(function() {
                $location.path('actions/' + dbAction._id);
                $location.path('actions');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
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


        // Find a list of Categories
        $scope.find = function() {
            $scope.actions = DbAction.query();
        };
        // Find existing Category
        $scope.findOne = function() {
            $scope.action = DbAction.get({
                actionId: $stateParams.actionsId
            });
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
