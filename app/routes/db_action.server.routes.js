'use strict';

module.exports = function(app) {
    var action = require('../../app/controllers/db_actions.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/actions')
      .get(action.list)
      .post(users.requiresLogin, action.create);

    // the categoryId param is added to the params object for the request
   app.route('/actions/:actionId')
    .get(action.read)
        .put(users.requiresLogin, action.update)
        .post(users.requiresLogin, action.update)
        .delete(users.requiresLogin, action.delete);

    // Finish by binding the article middleware
    // What's this? Where the categoryId is present in the URL
    // the logic to 'get by id' is handled by this single function
    // and added to the request object i.e. request.category.
    app.param('actionId', action.actionByID);
};
