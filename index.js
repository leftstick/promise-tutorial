'use strict';

var Promise = function(func) {
    this._resolves = [];
    this._rejectors = [];
    var promise = this;

    var handler = function(i, previous, useRejector) {
        if (i === promise._resolves.length) {
            return;
        }
        var result;
        try {
            result = promise[useRejector ? '_rejectors' : '_resolves'][i](previous);

            if (result instanceof Promise) {
                result.then(function(data) {
                    handler(i + 1, data);
                }, function(err) {
                    handler(i + 1, err, true);
                });
                return;
            }
            handler(i + 1, result);
        } catch (e) {
            handler(i + 1, e, true);
        }
    };

    var resolver = function(data) {
        process.nextTick(function() {
            handler(0, data);
        });
    };

    var rejector = function(err) {
        process.nextTick(function() {
            handler(0, err, true);
        });
    };

    func(resolver, rejector);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
    this._resolves.push(onFulfilled);
    this._rejectors.push(onRejected);
    return this;
};

module.exports = Promise;
