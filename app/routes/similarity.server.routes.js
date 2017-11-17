'use strict';

module.exports = function(app) {
    var similarity = require('../../app/controllers/similarity.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/similarity')
      .get(similarity.list)
      .post(users.requiresLogin, similarity.create);

   app.route('/similarity/launch')
        .put(users.requiresLogin, similarity.launch)
        .get(users.requiresLogin, similarity.launch);

    // the categoryId param is added to the params object for the request
   app.route('/similarity/:similarityId')
    .get(similarity.read)
        .put(users.requiresLogin, similarity.update)
        .post(users.requiresLogin, similarity.update)
        .delete(users.requiresLogin, similarity.delete);

    // Finish by binding the article middleware
    // What's this? Where the categoryId is present in the URL
    // the logic to 'get by id' is handled by this single function
    // and added to the request object i.e. request.category.
    app.param('similarityId', similarity.similarityByID);
};
