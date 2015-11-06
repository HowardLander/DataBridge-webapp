'use strict';

angular.module('db_actions')
  .controller('DbActionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'DbActions', 
    function($scope, $stateParams, $location, Authentication, DbAction) {
        // Create new Category
        $scope.create = function() {
            // Create new object
            var dbAction = new DbAction ({
                currentMessage: this.currentMessage,
                nameSpace: this.nameSpace
            });
            console.log('header1Key: ' , this.header1Key);
            console.log('header1Value: ' , this.header1Value);

           var headers = {};
           var headers2= {};
           headers[this.header1Key] = this.header1Value;
           headers2[this.header2Key] = this.header2Value;
         
           var stringified = JSON.stringify(headers);
           var parsed = JSON.parse(stringified);
         
           var stringified2 = JSON.stringify(headers2);
           var parsed2 = JSON.parse(stringified2);
           dbAction.headers = {};
           dbAction.headers[0] = parsed;
           dbAction.headers[1] = parsed2;
 
           console.log('headers: ' , headers);
           console.log('dbAction.headers: ' , dbAction.headers);

            // Redirect after save
            dbAction.$save(function(response) {
                $location.path('actions/add' + response._id);

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

            dbAction.$update(function() {
                $location.path('actions/' + dbAction._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.parseHeader = function(theHeader) {             
             console.log(theHeader);
             var headerObj = JSON.parse(theHeader);
             var key = Object.keys(headerObj)[0];
             console.log(key);
             var value = headerObj[key];
             return key;
          };

        // Find a list of Categories
        $scope.find = function() {
            console.log('in find: ' );
            $scope.actions = DbAction.query();
        };
        // Find existing Category
        $scope.findOne = function() {
            console.log('findOne: ' , $stateParams.actionsId);
            $scope.action = DbAction.get({
                actionId: $stateParams.actionsId
            });
            console.log('scope.action: ', $scope.action);
        };
    }
]).filter('headerKey', function() {
         return function(theHeader) {
             console.log(theHeader);
             var key = Object.keys(theHeader)[0];
             console.log(key);
             var value = theHeader[key];
             return key;
          };
}).filter('valueKey', function() {
         return function(theHeader) {
             console.log(theHeader);
             var key = Object.keys(theHeader)[0];
             console.log(key);
             var value = theHeader[key];
             return value;
          };
       });
