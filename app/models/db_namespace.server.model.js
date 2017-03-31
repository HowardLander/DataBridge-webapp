'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DbNameSpace Schema
 */
var DbNameSpaceSchema = new Schema({
    // Agent model fields
    description: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
    },

    nameSpace: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'nameSpace cannot be blank',
    }
});

DbNameSpaceSchema.set('collection', 'DB_NameSpace');
mongoose.model('DbNameSpace', DbNameSpaceSchema);
