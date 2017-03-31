'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    DBNameSpace = mongoose.model('DbNameSpace'),
    _ = require('lodash');

/**
 * Create a Db message
 */
exports.create = function(req, res) {
    console.log('in create namespace: ', req.namespace);
    var namespace = new DBNameSpace(req.body);

    namespace.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).json(namespace);
        }
    });

};

/**
 * Show the current Db message
 */
exports.read = function(req, res) {
    console.log('in read: ', req.nameSpace);
    res.json(req.nameSpace);
};

/**
 * Update a Db message
 */
exports.update = function(req, res) {
    console.log('in update for namespace');

    var namespace = req.nameSpace;
    console.log('namespace: ', namespace);
    namespace = _.extend(namespace, req.body);
    namespace.save(function(err) {
        if (err) {
            return res.status(400).send({
                namespace: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(namespace);
        }
    });
};

/**
 * Delete an Db message
 */
exports.delete = function(req, res) {
    console.log('in delete for namespace');
    var namespace = req.nameSpace;

    namespace.remove(function(err) {
        if (err) {
            return res.status(400).send({
                namespace: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(namespace);
        }
    });

};

/**
 * List of Db messages
 */
exports.list = function(req, res) {
    console.log('in list namespaces');
    DBNameSpace.find().exec(function(err, dbnamespace) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(dbnamespace);
        }
    });
};
exports.nameSpaceByID = function(req, res, next, id) {
    console.log('in ById for nameSpace: ', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            nameSpace: 'nameSpace is invalid'
        });
    }

    DBNameSpace.findById(id).exec(function(err, nameSpace) {
        if (err) return next(err);
        if (!nameSpace) {
            return res.status(404).send({
                nameSpace: 'nameSpace not found'
            });
        }
        req.nameSpace = nameSpace;
        next();
    });
};
