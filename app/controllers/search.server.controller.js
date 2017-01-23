'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    amqp = require('amqplib'),
    express = require('express'),
    DBSNAInstance = mongoose.model('DbSNAInstance'),
    DBCollection = mongoose.model('DbCollection'),
    DBSimilarityInstance = mongoose.model('DbSimilarityInstance'),
    _ = require('lodash');

var url = require('url');

/**
 * Find the all the namespaces that have SNA instances using "distinct"
 */
exports.list = function(req, res) {
    var parsedURL = url.parse(req.url, true);
    console.log('in list with ', parsedURL.query.thisSearch);
    DBCollection.find({'URL' : parsedURL.query.thisSearch},{'nameSpace': 1}).exec(function(err, dbsnainstance) {
        if (err) {
            return res.status(400).send({
                signature: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log(dbsnainstance);
            res.json(dbsnainstance);
        }
    });
};

/**
 * Find the all the metadata being that has been used as input to a similarity algorithm
 */
exports.metadata = function(req, res) {
    var parsedURL = url.parse(req.url, true);
    console.log('in metadata with ', parsedURL.query.nameSpace);
    DBSimilarityInstance.distinct('params', {'nameSpace' : parsedURL.query.nameSpace}, function(err, dbsiminstance) {
        if (err) {
            return res.status(400).send({
                signature: errorHandler.getErrorMessage(err)
            });
        } else {
            // remove any empty (legacy) items. They really shouldn't be there
            // but just in case.
            var processedInstance = dbsiminstance.filter(Boolean);
            console.log(processedInstance);
            res.json(processedInstance);
        }
    });
};

/**
 * Find the all the metadata being that has been used as input to a similarity algorithm
 */
exports.algorithms = function(req, res) {
    var parsedURL = url.parse(req.url, true);
    console.log('in algorithms with ', parsedURL.query.nameSpace, parsedURL.query.params);
    DBSimilarityInstance.distinct('className', {'nameSpace' : parsedURL.query.nameSpace, 'params' : parsedURL.query.params}, function(err, dbsiminstance) {
        if (err) {
            return res.status(400).send({
                signature: errorHandler.getErrorMessage(err)
            });
        } else {
            // remove any empty (legacy) items. They really shouldn't be there
            // but just in case.
            var processedInstance = dbsiminstance.filter(Boolean);
            console.log(processedInstance);
            res.json(processedInstance);
        }
    });
};

function bail(err) {
    console.error(err);
}

function publisher (req,res) {
var amqp = require('amqplib');
var basename = require('path').basename;
var Promise = require('bluebird');
var uuid = require('node-uuid');
var parsedURL = url.parse(req.url, true);
var app = express();
console.log('in publisher with ', parsedURL.query.nameSpace);

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
        var sendHeaders = {};
        var nameHeader = 'Find.Closest.Matches.In.Network';
        sendHeaders.type = 'databridge';
        sendHeaders.subtype = 'network';
        sendHeaders.name = nameHeader;
        sendHeaders.nameSpace = parsedURL.query.nameSpace;
        sendHeaders.count = parsedURL.query.nMatches;
        sendHeaders.params = parsedURL.query.params;
        sendHeaders.matchDataset = parsedURL.query.searchURL;
        sendHeaders.className = parsedURL.query.algorithm;
        ch.sendToQueue(req.app.locals.AMQPRPCExchange, new Buffer('test'), {
          correlationId: corrId, replyTo: queue, headers: sendHeaders
        });
      });
    });
  })
  .then(function(result) {
    // This doesn't seem like it should be needed, but it is!
    result.content = result.content.toString();
    res.json(result);
  })
  .finally(function() { conn.close(); });
}).catch(console.warn);
}

exports.launch = function(req, res) {
   console.log('in launch');
   publisher(req, res);
};
