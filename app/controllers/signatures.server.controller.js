'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    amqp = require('amqplib'),
    DBSignature = mongoose.model('DbSignature'),
    _ = require('lodash');

/**
 * Create a Db signature
 */
exports.create = function(req, res) {
    console.log('in create: ', req.signature);
    var signature = new DBSignature(req.body);

    signature.save(function(err) {
        if (err) {
            return res.status(400).send({
                signature: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).json(signature);
        }
    });

};

/**
 * Show the current Db signature
 */
exports.read = function(req, res) {
    console.log('in read: ', req.signature);
    res.json(req.signature);
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
    var signature = req.signature;

    signature.remove(function(err) {
        if (err) {
            return res.status(400).send({
                signature: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(signature);
        }
    });

};

/**
 * List of Db signatures
 */
exports.list = function(req, res) {
    console.log('in list');
    DBSignature.find().exec(function(err, dbsignature) {
        if (err) {
            return res.status(400).send({
                signature: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(dbsignature);
        }
    });
};
exports.signatureByID = function(req, res, next, id) {
    console.log('in ById: ', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            signature: 'Signature is invalid'
        });
    }

    DBSignature.findById(id).exec(function(err, signature) {
        if (err) return next(err);
        if (!signature) {
            return res.status(404).send({
                signature: 'Signature not found'
            });
        }
        req.signature = signature;
        next();
    });
};

exports.launch = function(req, res) {
    console.log('in execute');
    console.log('signatureId: ', req.body.signatureId);
    console.log('className: ', req.body.className);
    console.log('nameSpace: ', req.body.nameSpace);
    console.log('outputFile: ', req.body.outputFile);

    var amqp = require('amqplib');
    var when = require('when');

    // Default values for these.  Maybe they will eventually come from the client.
    var AMQPHost = 'amqp://localhost';
    var AMQPExchange = 'integration-test-howard';
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
          //console.log(" [x] Sent event with header %s:%s", message, key, value);
          return ch.close();
        });
      })).ensure(function() { conn.close(); });
    }).then(null, console.log);
/*
*/
    return res.status(204);
};
