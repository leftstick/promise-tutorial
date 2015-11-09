'use strict';
var PPP = require('../index');
var should = require('should');
var sinon = require('sinon');


describe('Promise', function() {

    it('then is called', function(done) {
        var onFulfilled = sinon.spy();

        new PPP(function(resolve, reject) {
            resolve();
        })
            .then(onFulfilled);

        setTimeout(function() {
            should(onFulfilled.called).be.true();
            done();
        }, 100);
    });

    it('chainable with immediately evaluated value returned', function(done) {
        var onFulfilled = sinon.stub().returns('Hello');
        var onFulfilledSec = sinon.spy();

        new PPP(function(resolve, reject) {
            resolve();
        })
            .then(onFulfilled)
            .then(onFulfilledSec);

        setTimeout(function() {
            should(onFulfilled.callCount).be.eql(1);
            should(onFulfilledSec.calledWith('Hello')).be.true();
            done();
        }, 100);
    });

    it('chainable with promise returned', function(done) {
        var onFulfilled = function() {
            return new PPP(function(resolve, reject) {
                resolve('Hello');
            });
        };
        var onFulfilledSec = sinon.spy();

        new PPP(function(resolve, reject) {
            resolve();
        })
            .then(onFulfilled)
            .then(onFulfilledSec);

        setTimeout(function() {
            should(onFulfilledSec.calledWith('Hello')).be.true();
            done();
        }, 100);
    });

    it('catch with error message', function(done) {
        var err = new Error('fuck');
        var onFirstCall = sinon.spy();
        var onErrorHandler = sinon.spy();

        new PPP(function(resolve, reject) {
            reject(err);
        })
            .then(onFirstCall, onErrorHandler);

        setTimeout(function() {
            should(onFirstCall.called).be.false();
            should(onErrorHandler.calledWith(err)).be.true();
            done();
        }, 100);
    });

    it('catch with error', function(done) {
        var onFirstCall = sinon.spy();
        var onErrorHandler = function() {
            return new PPP(function(resolve, reject) {
                resolve('I_AM_BACK');
            });
        };
        var onSecondCall = sinon.spy();

        new PPP(function(resolve, reject) {
            reject(new Error('fuck'));
        })
            .then(onFirstCall, onErrorHandler)
            .then(onSecondCall);

        setTimeout(function() {
            should(onFirstCall.called).be.false();
            should(onSecondCall.calledWith('I_AM_BACK')).be.true();
            done();
        }, 100);
    });

});
