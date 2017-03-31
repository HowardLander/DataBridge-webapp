'use strict';

module.exports = function(app) {
    var namespaces = require('../../app/controllers/namespaces.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/namespaces')
      .get(namespaces.list)
      .post(users.requiresLogin, namespaces.create);

    // the categoryId param is added to the params object for the request
   app.route('/namespaces/:namespaceId')
    .get(namespaces.read)
        .put(users.requiresLogin, namespaces.update)
        .post(users.requiresLogin, namespaces.update)
        .delete(users.requiresLogin, namespaces.delete);

    // Finish by binding the article middleware
    // What's this? Where the categoryId is present in the URL
    // the logic to 'get by id' is handled by this single function
    // and added to the request object i.e. request.category.
    app.param('namespaceId', namespaces.nameSpaceByID);
};
