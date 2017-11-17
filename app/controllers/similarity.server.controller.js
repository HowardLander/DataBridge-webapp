'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    amqp = require('amqplib'),
    DBSimilarity = mongoose.model('DbSimilarity'),
    express = require('express'),
    url = require('url'),
    _ = require('lodash');

/**
 * Create a Db similarity
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
 * Show the current Db similarity
 */
exports.read = function(req, res) {
    console.log('in read: ', req.similarity);
    res.json(req.similarity);
};

/**
 * Update a Db similarity
 */
exports.update = function(req, res) {
    console.log('in update for similarity');
    var similarity = req.similarity;
    console.log('similarity: ', similarity);
    similarity = _.extend(similarity, req.body);
    similarity.save(function(err) {
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
 * Delete an Db similarity
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
 * List of Db similarity
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



function publisher (req,res) {
var amqp = require('amqplib');
var basename = require('path').basename;
var Promise = require('bluebird');
var uuid = require('node-uuid');
var parsedURL = url.parse(req.url, true);
var app = express();
console.log('in similarity publisher with query', parsedURL.query);
console.log('in similarity publisher with ', parsedURL.query.nameSpace);
console.log('in similarity publisher with ', parsedURL.nameSpace);

amqp.connect(req.app.locals.AMQPHost).then(function(conn) {
  return conn.createChannel().then(function(ch) {
    return new Promise(function(resolve) {
      var corrId = uuid();
      function maybeAnswer(msg) {
        if (msg.properties.correlationId === corrId) {
          resolve(msg);
        }
      }

      var ok = ch.assertQueue('', {exclusive: true})
        .then(function(qok) { return qok.queue; });

      ok = ok.then(function(queue) {
        return ch.consume(queue, maybeAnswer, {noAck: true})
          .then(function() { return queue; });
      });

      ok = ok.then(function(queue) {
        console.log(' [x] Requesting service');
        console.log(' replyTo is: ', queue);
        console.log(' sending to: ', req.app.locals.AMQPRelevanceRPCExchange);
        var sendHeaders = {};
        var nameHeader = 'Create.SimilarityMatrix.Java.MetadataDB.URI.RPC';
        sendHeaders.type = 'databridge';
        sendHeaders.subtype = 'relevance';
        sendHeaders.name = nameHeader;
        sendHeaders.className = parsedURL.query.className;
        sendHeaders.params = parsedURL.query.parameters;
        sendHeaders.nameSpace = parsedURL.query.nameSpace;
        ch.sendToQueue(req.app.locals.AMQPRelevanceRPCExchange, new Buffer('test'), {
          correlationId: corrId, replyTo: queue, headers: sendHeaders
        });
      });
    });
  })
  .then(function(result) {
    // This doesn't seem like it should be needed, but it is!
    result.content = result.content.toString();
    console.log('result: ', result.content);
    //result =  res.json(result.content);
    res.json(result);
  })
  .finally(function() { conn.close(); });
}).catch(console.warn);
}


exports.launch = function(req, res) {
   console.log('in launch for similarity');
   publisher(req, res);
};

exports.launch.prv = function(req, res) {
    console.log('in execute');
    console.log('similarityId: ', req.body.similarityId);
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
