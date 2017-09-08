'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    amqp = require('amqplib'),
    DBLane = mongoose.model('DbLane'),
    _ = require('lodash');

/**
 * Create a Db lane
 */
exports.create = function(req, res) {
    console.log('in create: ', req.body);
    var lane = new DBLane(req.body);

    lane.save(function(err) {
        if (err) {
            console.log(errorHandler.getErrorMessage(err));
            return res.status(400).send({
                lane: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).json(lane);
        }
    });

};

/**
 * Show the current Db lane
 */
exports.read = function(req, res) {
    console.log('in read: ', req.lane);
    res.json(req.lane);
};

/**
 * Update a Db lane
 */
exports.update = function(req, res) {
    console.log('in update for lane');
    var lane = req.lane;
    console.log('lane: ', lane);
    lane = _.extend(lane, req.body);
    lane.save(function(err) {
        if (err) {
            return res.status(400).send({
                lane: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(lane);
        }
    });
};

/**
 * Delete an Db lane
 */
exports.delete = function(req, res) {
    console.log('in delete');
    var lane = req.lane;

    lane.remove(function(err) {
        if (err) {
            return res.status(400).send({
                lane: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(lane);
        }
    });

};

/**
 * List of Db lane
 */
exports.list = function(req, res) {
    console.log('in list for lanes');
    DBLane.find().exec(function(err, dblane) {
        if (err) {
            return res.status(400).send({
                lane: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(dblane);
        }
    });
};
exports.laneByID = function(req, res, next, id) {
    console.log('in ById for lanes: ', id, ':', ':');

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('invalid ');
        return res.status(400).send({
            lane: 'lane is invalid'
        });
    }

    DBLane.findById(id).exec(function(err, lane) {
        if (err)  console.log(errorHandler.getErrorMessage(err));
        if (err) return next(err);
        if (!lane) {
            console.log('failed to find requested lane ');
            return res.status(404).send({
                lane: 'Lane not found'
            });
        }
        req.lane = lane;
        console.log('lane is', req.lane);
        next();
    });
};

exports.launch = function(req, res) {
    console.log('in execute');
    console.log('laneId: ', req.body.laneId);
    console.log('className: ', req.body.className);
    console.log('nameSpace: ', req.body.nameSpace);
    console.log('outputFile: ', req.body.outputFile);

    var amqp = require('amqplib');
    var when = require('when');

    // Default values for these.  Maybe they will eventually come from the client.
    var AMQPHost = req.app.locals.AMQPHost;
    var AMQPExchange = req.app.locals.AMQPExchange;
    var nameHeader = 'Create.SimilarityMatrix.Java.MetadataDB.URI';

    amqp.connect(AMQPHost).then(function(conn) {
      return when(conn.createChannel().then(function(ch) {
        var ex = AMQPExchange;
        var ok = ch.assertExchange(ex, 'headers', {durable: true});
        return ok.then(function() {
          // Use the "headers" array in the options object to pass the header
          var options = {};
          options.headers = {};
          var message = '';

          // Key value pair
          options.headers.type = 'databridge';
          options.headers.subtype = 'relevance';
          options.headers.name = nameHeader;
          options.headers.className = req.body.className;
          options.headers.outputFile = req.body.outputFile;
          options.headers.nameSpace = req.body.nameSpace;
          ch.publish(ex, '', new Buffer(message), options);
          console.log(' [x] Sent event with options %s', options);
          return ch.close();
        });
      })).ensure(function() { conn.close(); });
    }).then(null, console.log);
/*
*/
    return res.status(204);
};
