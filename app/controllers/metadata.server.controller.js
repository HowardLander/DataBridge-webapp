'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    amqp = require('amqplib'),
    DBMetadata = mongoose.model('DbMetadata'),
    _ = require('lodash');

/**
 * Create a Db signature
 */
exports.create = function(req, res) {
    console.log('in create: ', req.metadata);
    var metadata = new DBMetadata(req.body);

    metadata.save(function(err) {
        if (err) {
            return res.status(400).send({
                metadata: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).json(metadata);
        }
    });

};

/**
 * Show the current Db signature
 */
exports.read = function(req, res) {
    console.log('in read: ', req.metadata);
    res.json(req.metadata);
};

/**
 * Update a Db signature
 */
exports.update = function(req, res) {
    console.log('in update');

};

/**
 * Delete an Db signature
 */
exports.delete = function(req, res) {
    console.log('in delete');
    var metadata = req.metadata;

    metadata.remove(function(err) {
        if (err) {
            return res.status(400).send({
                metadata: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(metadata);
        }
    });

};

/**
 * List of Db signatures
 */
exports.list = function(req, res) {
    console.log('in list');
    DBMetadata.find().exec(function(err, dbmetadata) {
        if (err) {
            return res.status(400).send({
                metadata: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(dbmetadata);
        }
    });
};
exports.metadataByID = function(req, res, next, id) {
    console.log('in ById: ', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            signature: 'Signature is invalid'
        });
    }

    DBMetadata.findById(id).exec(function(err, metadata) {
        if (err) return next(err);
        if (!metadata) {
            return res.status(404).send({
                metadata: 'Metadata not found'
            });
        }
        req.metadata = metadata;
        next();
    });
};

exports.launch = function(req, res) {
    console.log('in execute');
    console.log('signatureId: ', req.body.signatureId);
    console.log('className: ', req.body.className);
    console.log('nameSpace: ', req.body.nameSpace);
    console.log('input: ', req.body.input);
    console.log('parameters: ', req.body.parameters);

    var amqp = require('amqplib');
    var when = require('when');

    // Default values for these.  Maybe they will eventually come from the client.
    var AMQPHost = 'amqp://localhost';
    var AMQPExchange = 'integration-test-howard';
    var nameHeader = 'Create.Metadata.Java.To.URI';

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
          options.headers.subtype = 'ingestmetadata';
          options.headers.name = nameHeader;
          options.headers.className = req.body.className;
          options.headers.inputURI = req.body.input;
          options.headers.outputURI = req.body.output;
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
