'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DbSignatures Schema
 */
var DbSimilaritySchema = new Schema({
    // Agent model fields
    className: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'message cannot be blank',
    },

    type: {
        type: String,
        default: 'java class',
        trim: true,
        unique : false,
        // make this a required field
        required: 'type cannot be blank',
    },

    description: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'description cannot be blank',
    }

});

DbSimilaritySchema.set('collection', 'DB_Similarities');
mongoose.model('DbSimilarity', DbSimilaritySchema);
