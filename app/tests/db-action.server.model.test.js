'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	DbAction = mongoose.model('DbAction');

/**
 * Globals
 */
var dbAction;

/**
 * Unit tests
 */
describe('Db action Model Unit Tests:', function() {
    describe('Saving', function() {
        it('saves new record');

        it('throws validation error when name is empty');

        it('throws validation error when name longer than 15 chars');

        it('throws validation error for duplicate category name');
    });

});
