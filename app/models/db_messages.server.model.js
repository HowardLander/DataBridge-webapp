'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DbMessages Schema
 */
var DbMessageSchema = new Schema({
    // Agent model fields
    message: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'message cannot be blank',
    },

    type: {
        type: String,
        default: 'databridge',
        trim: true,
        unique : false,
        // make this a required field
        required: 'type cannot be blank',
    },

    subType: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'subtype cannot be blank',
    },

    description: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'description cannot be blank',
    },

    headers:[{
       type: String
    }] 
    
});

DbMessageSchema.set('collection', 'DB_Messages');
mongoose.model('DbMessage', DbMessageSchema);
