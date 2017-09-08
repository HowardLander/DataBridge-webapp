'use strict';

module.exports = function(app) {
    var lanes = require('../../app/controllers/lanes.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/lanes')
      .get(lanes.list)
      .post(users.requiresLogin, lanes.create);

    // the categoryId param is added to the params object for the request
   app.route('/lanes/:laneId')
    .get(lanes.read)
        .put(users.requiresLogin, lanes.update)
        .post(users.requiresLogin, lanes.update)
//       .get(lanes.laneByID)
        .delete(users.requiresLogin, lanes.delete);

    // Finish by binding the article middleware
    // What's this? Where the categoryId is present in the URL
    // the logic to 'get by id' is handled by this single function
    // and added to the request object i.e. request.category.
    app.param('laneId', lanes.laneByID);
};
