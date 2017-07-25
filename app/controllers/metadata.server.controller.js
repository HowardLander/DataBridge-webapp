'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    amqp = require('amqplib'),
    DBMetadata = mongoose.model('DbMetadata'),
   express = require('express'),
    _ = require('lodash');

var url = require('url');
/**
 * Create a Db metadata
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
 * Show the current Db metadata
 */
exports.read = function(req, res) {
    console.log('in read: ', req.metadata);
    res.json(req.metadata);
};

/**
 * Update a Db metadata
 */
exports.update = function(req, res) {
    console.log('in update for metadata');
    var metadata = req.metadata;
    console.log('metadata: ', metadata);
    metadata = _.extend(metadata, req.body);
    metadata.save(function(err) {
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
 * Delete an Db metadata
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
 * List of Db metadata
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
            metadata: 'Metadata is invalid'
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


function publisher (req,res) {
var amqp = require('amqplib');
var basename = require('path').basename;
var Promise = require('bluebird');
var uuid = require('node-uuid');
var parsedURL = url.parse(req.url, true);
var app = express();
console.log('in metadata publisher with query', parsedURL.query);
console.log('in metadata publisher with ', parsedURL.query.nameSpace);

amqp.connect(req.app.locals.AMQPHost).then(function(conn) {
  return conn.createChannel().then(function(ch) {
    return new Promise(function(resolve) {
      var corrId = uuid();
      function maybeAnswer(msg) {
        if (msg.properties.correlationId === corrId) {
          //resolve(msg.content.toString());
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
        var sendHeaders = {};
        var nameHeader = 'Insert.Metadata.Java.FileWithParams.MetadataDB.RPC';
        sendHeaders.type = 'databridge';
        sendHeaders.subtype = 'ingestmetadata';
        sendHeaders.name = nameHeader;
        sendHeaders.nameSpace = parsedURL.query.nameSpace;
        sendHeaders.params = parsedURL.query.parameters;
        sendHeaders.className = parsedURL.query.className;
        sendHeaders.inputFile = parsedURL.query.input;
        ch.sendToQueue(req.app.locals.AMQPIngestRPCExchange, new Buffer('test'), {
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
   console.log('in launch');
   publisher(req, res);
};

exports.launch.prv = function(req, res) {
    console.log('in execute');
    console.log('metadata: ', req.body.metadata);
    console.log('className: ', req.body.className);
    console.log('nameSpace: ', req.body.nameSpace);
    console.log('input: ', req.body.input);
    console.log('parameters: ', req.body.parameters);

    var amqp = require('amqplib');
    var when = require('when');

    // Default values for these.  Maybe they will eventually come from the client.
    var AMQPHost = req.app.locals.AMQPHost;
    var AMQPExchange = req.app.locals.AMQPExchange;
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
