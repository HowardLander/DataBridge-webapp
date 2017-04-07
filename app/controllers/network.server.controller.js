'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    amqp = require('amqplib'),
    DBNetwork = mongoose.model('DbNetwork'),
    _ = require('lodash');

/**
 * Create a Db network
 */
exports.create = function(req, res) {
    console.log('in create: ', req.network);
    var network = new DBNetwork(req.body);

    network.save(function(err) {
        if (err) {
            return res.status(400).send({
                network: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).json(network);
        }
    });

};

/**
 * Show the current Db network
 */
exports.read = function(req, res) {
    console.log('in read: ', req.network);
    res.json(req.network);
};

/**
 * Update a Db network
 */
exports.update = function(req, res) {
    console.log('in update for network');
    var network = req.network;
    console.log('network: ', network);
    network = _.extend(network, req.body);
    network.save(function(err) {
        if (err) {
            return res.status(400).send({
                network: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(network);
        }
    });

};

/**
 * Delete an Db network
 */
exports.delete = function(req, res) {
    console.log('in delete');
    var network = req.network;
    console.log('req.network: ', req.network);

    network.remove(function(err) {
        if (err) {
            return res.status(400).send({
                network: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(network);
        }
    });

};

/**
 * List of Db network
 */
exports.list = function(req, res) {
    console.log('in list');
    DBNetwork.find().exec(function(err, dbnetwork) {
        if (err) {
            return res.status(400).send({
                network: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(dbnetwork);
        }
    });
};
exports.networkByID = function(req, res, next, id) {
    console.log('in ById: ', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            network: 'Network is invalid'
        });
    }

    DBNetwork.findById(id).exec(function(err, network) {
        if (err) return next(err);
        if (!network) {
            return res.status(404).send({
                network: 'Network not found'
            });
        }
        req.network = network;
        next();
    });
};

exports.launch = function(req, res) {
    console.log('in execute');
    console.log('similarityId: ', req.body.similarityId);
    console.log('className: ', req.body.className);
    console.log('nameSpace: ', req.body.nameSpace);
    console.log('input: ', req.body.input);
    console.log('parameters: ', req.body.parameters);

    var amqp = require('amqplib');
    var when = require('when');

    // Default values for these.  Maybe they will eventually come from the client.
    var AMQPHost = req.app.locals.AMQPHost;
    var AMQPExchange = req.app.locals.AMQPExchange;
    var nameHeader = 'Run.SNA.Algorithm.FileIO.NetworkDB';

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
          options.headers.subtype = 'network';
          options.headers.name = nameHeader;
          options.headers.executable = req.body.className;
          options.headers.nameSpace = req.body.nameSpace;
          options.headers.similarityId = req.body.similarityId;
          options.headers.params = req.body.parameters;
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
