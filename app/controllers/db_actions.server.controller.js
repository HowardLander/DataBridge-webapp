'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    DBAction = mongoose.model('DbAction'),
    _ = require('lodash');

/**
 * Create a Db action
 */
exports.create = function(req, res) {
    console.log('in create: ', req.action);
    var action = new DBAction(req.body);

    action.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).json(action);
        }
    });

};

/**
 * Show the current Db action
 */
exports.read = function(req, res) {
    console.log('in read: ', req.action);
    res.json(req.action);
};

/**
 * Update a Db action
 */
exports.update = function(req, res) {
    console.log('in update action');
    var action = req.action;
    console.log('action: ', action);
    action = _.extend(action, req.body);
    action.save(function(err) {
        if (err) {
            return res.status(400).send({
                action: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(action);
        }
    });

};

/**
 * Delete an Db action
 */
exports.delete = function(req, res) {
    console.log('in delete');
    var action = req.action;

    action.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(action);
        }
    });

};

/**
 * List of Db actions
 */
exports.list = function(req, res) {
    console.log('in list');
    DBAction.find().exec(function(err, dbaction) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(dbaction);
        }
    });
};
exports.actionByID = function(req, res, next, id) {
    console.log('in ById: ', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Action is invalid'
        });
    }

    DBAction.findById(id).exec(function(err, action) {
        if (err) return next(err);
        if (!action) {
            return res.status(404).send({
                message: 'Action not found'
            });
        }
        req.action = action;
        next();
    });
};
