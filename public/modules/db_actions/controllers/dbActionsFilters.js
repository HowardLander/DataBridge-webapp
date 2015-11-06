'use strict';

angular.module('dbActionsFilters',[])
    .filter('key', function() {
         return function(theHeader) {
             console.log(theHeader);
   //          var headerObj = JSON.parse(theHeader);
    //         var key = Object.keys(headerObj)[0];
     //        console.log(key);
      //       var value = headerObj[key];
       //      return key;
               return 'Hello';
          };
       });
