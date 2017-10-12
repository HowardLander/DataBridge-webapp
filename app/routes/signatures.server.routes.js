'use strict';

module.exports = function(app) {
    var signature = require('../../app/controllers/signatures.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/signatures')
      .get(signature.list)
      .post(users.requiresLogin, signature.create);

   app.route('/signatures/launch')
        .put(users.requiresLogin, signature.launch)
        .get(users.requiresLogin, signature.launch);

    // the categoryId param is added to the params object for the request
   app.route('/signatures/:signatureId')
    .get(signature.read)
        .put(users.requiresLogin, signature.update)
        .post(users.requiresLogin, signature.update)
        .delete(users.requiresLogin, signature.delete);

    // Finish by binding the article middleware
    // What's this? Where the categoryId is present in the URL
    // the logic to 'get by id' is handled by this single function
    // and added to the request object i.e. request.category.
    app.param('signatureId', signature.signatureByID);
};
