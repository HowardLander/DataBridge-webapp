'use strict';

module.exports = function(app) {
    var search = require('../../app/controllers/search.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/search')
      .get(search.list);

    app.route('/search/metadata')
      .get(search.metadata);

    app.route('/search/algorithms')
      .get(search.algorithms);

    app.route('/search/instanceFinder')
      .get(search.instanceFinder);

   app.route('/search/launch')
      .get(users.requiresLogin, search.launch);

    // the categoryId param is added to the params object for the request
// app.route('/search/:searchId')
// .get(search.read)
//      .put(users.requiresLogin, search.update)
//      .delete(users.requiresLogin, search.delete);

    // Finish by binding the article middleware
    // What's this? Where the categoryId is present in the URL
    // the logic to 'get by id' is handled by this single function
    // and added to the request object i.e. request.category.
 // app.param('searchId', search.searchByID);
};
