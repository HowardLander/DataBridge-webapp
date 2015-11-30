'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DbSignatures Schema
 */
var DbMetadataSchema = new Schema({
    // Agent model fields
    className: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'class name cannot be blank',
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
    }

});

DbMetadataSchema.set('collection', 'DB_Metadata_Algorithms');
mongoose.model('DbMetadata', DbMetadataSchema);
