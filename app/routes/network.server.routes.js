'use strict';

module.exports = function(app) {
    var network = require('../../app/controllers/network.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/network')
      .get(network.list)
      .post(users.requiresLogin, network.create);

   app.route('/network/launch')
        .put(users.requiresLogin, network.launch);

    // the categoryId param is added to the params object for the request
   app.route('/network/:networkId')
    .get(network.read)
        .put(users.requiresLogin, network.update)
        .post(users.requiresLogin, network.update)
        .delete(users.requiresLogin, network.delete);

    // Finish by binding the article middleware
    // What's this? Where the categoryId is present in the URL
    // the logic to 'get by id' is handled by this single function
    // and added to the request object i.e. request.category.
    app.param('networkId', network.networkByID);
};
