'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DbLane Schema
 */
var DbLaneSchema = new Schema({
    // Agent model fields
    name: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'name cannot be blank',
    },

    ingestImpl: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    ingestParams: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    signatureImpl: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    signatureParams: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    similarityImpl: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    similarityParams: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    SNAImpl: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    SNAParams: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    creatorId: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    description: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
    },

    nameSpaces:[{
       type: Schema.Types.Mixed
    }] 
    
});

DbLaneSchema.set('collection', 'DB_Lane');
mongoose.model('DbLane', DbLaneSchema);
