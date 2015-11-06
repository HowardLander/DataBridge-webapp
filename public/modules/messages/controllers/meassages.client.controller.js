'use strict';

angular.module('messages')
  .controller('DbMessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'DbMessages', 
    function($scope, $stateParams, $location, Authentication, DbMessage) {
        $scope.values = {};

        // Create new Category
        $scope.create = function() {
            // Create new object
            var dbMessage = new DbMessage ({
                message: this.message,
                type: this.type,
                subType: this.subType,
                description: this.description
            });
            console.log('message: ' , this.message);
            console.log('subType: ' , this.subType);

           var headers = {};
           headers[0] = this.header1;
           headers[1] = this.header2;
           headers[2] = this.header3;
           headers[3] = this.header4;
           dbMessage.headers = headers;
         
            // Redirect after save
            dbMessage.$save(function(response) {
                $location.path('messages/create' + response._id);

                // Clear form fields
                $scope.message = '';
                $scope.type = '';
                $scope.description = '';
                headers[0] = '';
                headers[1] = '';
                headers[2] = '';
                headers[3] = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Category
        $scope.remove = function(dbMessage) {
            if ( dbMessage ) {
                dbMessage.$remove();

                for (var i in $scope.messages) {
                    if ($scope.messages [i] === dbMessage) {
                        $scope.messages.splice(i, 1);
                    }
                }
            } else {
                $scope.message.$remove(function() {
                    $location.path('messages');
                });
            }
        };

        // Update existing Category
        $scope.update = function() {
            var dbMessage = $scope.message;

            dbMessage.$update(function() {
                $location.path('messages/' + dbMessage._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Messages
        $scope.find = function() {
            console.log('in find: ' );
            $scope.messages = DbMessage.query();
        };
        // Find existing Category
        $scope.findOne = function() {
            console.log('findOne: ' , $stateParams.messageId);
            $scope.message = DbMessage.get({
                messageId: $stateParams.messageId
            });
            console.log('scope.message: ', $scope.message);
        };

        $scope.execute = function() {
            console.log('execute: ' , $stateParams.messageId);
            console.log('headers: ', $scope.message.headers);
            console.log('values: ', $scope.values);
        };
    }
]);
