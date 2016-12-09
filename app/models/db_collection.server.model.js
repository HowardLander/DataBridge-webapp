'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DbCollection Schema
 */
var DbCollectionSchema = new Schema({
    // Agent model fields
    URL: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'URL cannot be blank',
    },

    title: {
        type: String,
        default: '',
        trim: true,
        unique : false,
        // make this a required field
        required: 'title cannot be blank',
    },

    description: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    producer: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    subject: {
        type: String,
        default: '',
        trim: true,
        unique : false,
    },

    keywords: {
        type: [String],
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


    extra:[{
       type: Schema.Types.Mixed
    }] 
    
});

DbCollectionSchema.set('collection', 'DB_Collection');
mongoose.model('DbCollection', DbCollectionSchema);
