'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    DBMessage = mongoose.model('DbMessage'),
    _ = require('lodash');

/**
 * Create a Db message
 */
exports.create = function(req, res) {
    console.log('in create: ', req.message);
    var message = new DBMessage(req.body);

    message.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).json(message);
        }
    });

};

/**
 * Show the current Db message
 */
exports.read = function(req, res) {
    console.log('in read: ', req.message);
    res.json(req.message);
};

/**
 * Update a Db message
 */
exports.update = function(req, res) {
    console.log('in update in messages');
    var message = req.message;
    console.log('message: ', message);
    message = _.extend(message, req.body);
    message.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(message);
        }
    });

};

/**
 * Delete an Db message
 */
exports.delete = function(req, res) {
    console.log('in delete');
    var message = req.message;

    message.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(message);
        }
    });

};

/**
 * List of Db messages
 */
exports.list = function(req, res) {
    console.log('in list');
    DBMessage.find().exec(function(err, dbmessage) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(dbmessage);
        }
    });
};
exports.messageByID = function(req, res, next, id) {
    console.log('in ById: ', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Message is invalid'
        });
    }

    DBMessage.findById(id).exec(function(err, message) {
        if (err) return next(err);
        if (!message) {
            return res.status(404).send({
                message: 'Message not found'
            });
        }
        req.message = message;
        next();
    });
};
