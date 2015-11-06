'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/*
var HeaderSchema = new Schema({
    key:{
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'key cannot be blank',
    },
    value:{
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'value cannot be blank',
    }
});

var HeaderSchema = new Schema({
    array: []
});
*/

/**
 * DbAction Schema
 */
var DbActionSchema = new Schema({
    // Agent model fields
    currentMessage: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'currentMessage cannot be blank',
    },

    nameSpace: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'nameSpace cannot be blank',
    },

    headers:[{
       type: Schema.Types.Mixed
    }] 
    
});

DbActionSchema.set('collection', 'DB_Action');
mongoose.model('DbAction', DbActionSchema);
