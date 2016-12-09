'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    amqp = require('amqplib'),
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
console.log('in publisher with ', parsedURL.query.nameSpace);

amqp.connect('amqp://localhost').then(function(conn) {
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
        ch.sendToQueue('network-test-howard-rpcQueue', new Buffer('test'), {
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


function publisher1(req,res) {
    var amqplib = require('amqplib');
    var request = require('amqplib-rpc').request;
    var AMQPHost = 'amqp://localhost';
    //var AMQPExchange = 'integration-test-howard';
    var AMQPExchange = 'network-test-howard-primary';
    var nameHeader = 'Find.Closest.Matches.In.Network';
    var options = {};
    options.headers = {};
    var message = '';
    options.headers.type = 'databridge';
    options.headers.subtype = 'network';
    options.headers.name = nameHeader;
    options.headers.nameSpace = 'clinicalTrials-100';
    options.headers.count = 10;
    options.headers.matchDataset = 'https://clinicaltrials.gov/ct2/show/record/NCT00001962';
    options.headers.className = 'org.renci.databridge.contrib.similarity.renci.RenciCosine';

   amqplib.connect(AMQPHost).then(function (connection) {
     return request(connection, AMQPExchange,message, options).then(function (replyMessage) {
       console.log(replyMessage.content.toString()); // 200
     });
   });
}

function publisher2(req, res) {
    console.log('in execute');
//    console.log('signatureId: ', req.body.signatureId);
//    console.log('className: ', req.body.className);
//    console.log('nameSpace: ', req.body.nameSpace);
//    console.log('input: ', req.body.input);
//    console.log('parameters: ', req.body.parameters);

    var amqp = require('amqplib');
    var when = require('when');

    // Default values for these.  Maybe they will eventually come from the client.
    var AMQPHost = 'amqp://localhost';
    var AMQPExchange = 'integration-test-howard';
    var nameHeader = 'Find.Closest.Matches.In.Network';
    amqp.connect(AMQPHost).then(function(conn) {
      return when(conn.createChannel().then(function(ch) {
        var ex = AMQPExchange;
        //var ok = ch.assertExchange(ex, 'headers', {durable: true});
        var ok = ch.checkExchange(ex);
        return ok.then(function() {
          // Use the "headers" array in the options object to pass the header
          var options = {};
          options.headers = {};
          var message = '';

          // Key value pair
          options.headers.type = 'databridge';
          options.headers.subtype = 'network';
          options.headers.name = nameHeader;
          options.headers.nameSpace = 'clinicalTrials-100';
          options.headers.count = 10;
          options.headers.matchDataset = 'https://clinicaltrials.gov/ct2/show/record/NCT00001962';
          options.headers.className = 'org.renci.databridge.contrib.similarity.renci.RenciCosine';
          options.headers.params = 'keywords';
          ch.publish(ex, '', new Buffer(message), options);
          console.log(' [x] Sent event with options %s', options);

          return ch.close();
        });
      })).ensure(function() { conn.close(); });
    }).then(null, console.log);
}

function consumer(req, res ) {
      var amqp = require('amqplib');
      var when = require('when');
      var AMQPHost = 'amqp://localhost';
      var AMQPExchange = 'integration-test-howard';
      var nameHeader = 'Find.Closest.Matches.In.Network';
      amqp.connect(AMQPHost).then(function(conn) {
        return when(conn.createChannel().then(function(ch) {
        var ex = AMQPExchange;
        //var ok = ch.assertExchange(ex, 'headers', {durable: true});
        var ok = ch.checkExchange(ex);
        console.log('after checkExchange');
        return ok.then(function() {
           var options = {};
           options = {'type': 'databridge', 'subtype': 'networkresults', 'x-match': 'all'};
           ch.assertQueue('returnQueue', { exclusive: false });
           console.log('after assertQueue');
           return ch.bindQueue('returnQueue', AMQPExchange, 'unused', options).then(function(ok) {
              console.log('after bindQueue');
              return ch.consume('returnQueue', function(msg) {
                 console.log('after consumption');
                 if (msg !== null) {
                    console.log(msg);
                    console.log('headers: ', msg.headers);
                    console.log(msg.content);
                    ch.ack(msg);
                    res.send(msg);
                 }
              });
           });
        });
      })).ensure(function() { conn.close(); });
    });
}
/*
*/

exports.launch = function(req, res) {
   console.log('in launch');
//   publisher(req, res).then(consumer(req, res));

   publisher(req, res);
//   consumer(req, res);
};
