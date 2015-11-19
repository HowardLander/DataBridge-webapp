'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DbSignatures Schema
 */
var DbSignatureSchema = new Schema({
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

DbSignatureSchema.set('collection', 'DB_Signature_Algorithms');
mongoose.model('DbSignature', DbSignatureSchema);
