'use strict';

module.exports = function(app) {
    var message = require('../../app/controllers/messages.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/messages')
      .get(message.list)
      .post(users.requiresLogin, message.create);

    // the categoryId param is added to the params object for the request
   app.route('/messages/:messageId')
    .get(message.read)
        .put(users.requiresLogin, message.update)
        .post(users.requiresLogin, message.update)
        .delete(users.requiresLogin, message.delete);

    // Finish by binding the article middleware
    // What's this? Where the categoryId is present in the URL
    // the logic to 'get by id' is handled by this single function
    // and added to the request object i.e. request.category.
    app.param('messageId', message.messageByID);
};
