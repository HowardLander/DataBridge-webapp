'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DbSNAInstance Schema
 */
var DbSNAInstanceSchema = new Schema({
    // Agent model fields
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

    nResultingClusters: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    nameSpace: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    params: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    similarityInstanceId: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    }

});

DbSNAInstanceSchema.set('collection', 'DB_SNAInstance');
mongoose.model('DbSNAInstance', DbSNAInstanceSchema);
