'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    amqp = require('amqplib'),
    DBSimilarity = mongoose.model('DbSimilarity'),
    _ = require('lodash');

/**
 * Create a Db signature
 */
exports.create = function(req, res) {
    console.log('in create: ', req.similarity);
    var similarity = new DBSimilarity(req.body);

    similarity.save(function(err) {
        if (err) {
            return res.status(400).send({
                similarity: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).json(similarity);
        }
    });

};

/**
 * Show the current Db signature
 */
exports.read = function(req, res) {
    console.log('in read: ', req.similarity);
    res.json(req.similarity);
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
    var similarity = req.similarity;

    similarity.remove(function(err) {
        if (err) {
            return res.status(400).send({
                similarity: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(similarity);
        }
    });

};

/**
 * List of Db signatures
 */
exports.list = function(req, res) {
    console.log('in list');
    DBSimilarity.find().exec(function(err, dbsimilarity) {
        if (err) {
            return res.status(400).send({
                similarity: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(dbsimilarity);
        }
    });
};
exports.similarityByID = function(req, res, next, id) {
    console.log('in ById: ', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            similarity: 'similarity is invalid'
        });
    }

    DBSimilarity.findById(id).exec(function(err, similarity) {
        if (err) return next(err);
        if (!similarity) {
            return res.status(404).send({
                similarity: 'Similarity not found'
            });
        }
        req.similarity = similarity;
        next();
    });
};

exports.launch = function(req, res) {
    console.log('in execute');
    console.log('similarityId: ', req.body.similarityId);
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
          console.log(' [x] Sent event with options %s', options);
          return ch.close();
        });
      })).ensure(function() { conn.close(); });
    }).then(null, console.log);
/*
*/
    return res.status(204);
};
