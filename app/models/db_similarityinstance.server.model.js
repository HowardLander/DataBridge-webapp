'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DbSimilarityInstance Schema
 */
var DbSimilarityInstanceSchema = new Schema({
    // Agent model fields
    nameSpace: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    className: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'class name cannot be blank',
    },

    method: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    version: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    output: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    count: {
        type: Number,
        default: '-1'
    },

    params: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    }

});

DbSimilarityInstanceSchema.set('collection', 'DB_SimilarityInstance');
mongoose.model('DbSimilarityInstance', DbSimilarityInstanceSchema);
