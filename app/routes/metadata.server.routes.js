'use strict';

module.exports = function(app) {
    var metadata = require('../../app/controllers/metadata.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/metadata')
      .get(metadata.list)
      .post(users.requiresLogin, metadata.create);

   app.route('/metadata/launch')
        .put(users.requiresLogin, metadata.launch);

    // the categoryId param is added to the params object for the request
   app.route('/metadata/:metadataId')
    .get(metadata.read)
        .put(users.requiresLogin, metadata.update)
        .post(users.requiresLogin, metadata.update)
        .delete(users.requiresLogin, metadata.delete);

    // Finish by binding the article middleware
    // What's this? Where the categoryId is present in the URL
    // the logic to 'get by id' is handled by this single function
    // and added to the request object i.e. request.category.
    app.param('metadataId', metadata.metadataByID);
};
