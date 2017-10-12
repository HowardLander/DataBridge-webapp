'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    amqp = require('amqplib'),
    DBSignature = mongoose.model('DbSignature'),
    express = require('express'),
    url = require('url'),
    _ = require('lodash');

/**
 * Create a Db signature
 */
exports.create = function(req, res) {
    console.log('in create: ', req.body);
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
    console.log('in update for signature');
    var signature = req.signature;
    console.log('signature: ', signature);
    signature = _.extend(signature, req.body);
    signature.save(function(err) {
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

function publisher (req,res) {
var amqp = require('amqplib');
var basename = require('path').basename;
var Promise = require('bluebird');
var uuid = require('node-uuid');
var parsedURL = url.parse(req.url, true);
var app = express();
console.log('in metadata publisher with query', parsedURL.query);
console.log('in metadata publisher with ', parsedURL.query.sourceNameSpace);

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
        var nameHeader = 'Create.Metadata.Signature.Java.MetadataDB.RPC';
        sendHeaders.type = 'databridge';
        sendHeaders.subtype = 'ingestmetadata';
        sendHeaders.name = nameHeader;
        sendHeaders.sourceNameSpace = parsedURL.query.sourceNameSpace;
        sendHeaders.targetNameSpace = parsedURL.query.targetNameSpace;
        sendHeaders.params = parsedURL.query.parameters;
        sendHeaders.className = parsedURL.query.className;
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
   console.log('in launch for signatures');
   publisher(req, res);
};

exports.launch.prv = function(req, res) {
    console.log('in execute');
    console.log('signatureId: ', req.body.signatureId);
    console.log('className: ', req.body.className);
    console.log('sourceNameSpace: ', req.body.sourceNameSpace);
    console.log('targetNameSpace: ', req.body.targetNameSpace);
    console.log('parameters: ', req.body.parameters);

    var amqp = require('amqplib');
    var when = require('when');

    // Default values for these.  Maybe they will eventually come from the client.
    var AMQPHost = req.app.locals.AMQPHost;
    var AMQPExchange = req.app.locals.AMQPExchange;
    var nameHeader = 'Create.Metadata.Signature.Java.MetadataDB';

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
          options.headers.nameSpace = req.body.nameSpace;
          options.headers.inputURI = req.body.input;
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
