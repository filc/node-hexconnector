'use strict';

var HexConnector = require("..");
var assert = require("assert");
var cn;

describe('Hex Connector', function() {

  describe('registerAdapter method', function () {

    beforeEach(function () {
        cn = new HexConnector();
    });

    it('should register a standard library', function () {
        cn.registerAdapter('simple_util', 'util');
        assert.equal(true, cn.adapters.simple_util.isBoolean(true));
        assert.equal(false, cn.adapters.simple_util.isBoolean(1));
    });

    it('should register an own module with init method and config injection', function () {
        cn.registerAdapter('own_util', __dirname + '/test-adapters/fake-util', {k1: 'v1'});
        assert.equal(true, cn.adapters.own_util.initialized);
        assert.equal(true, cn.adapters.own_util.initializedWithConfig);
        assert.deepEqual({k1: 'v1'}, cn.adapters.own_util.config);
    });

    it('should instantiate different connectors', function () {
        cn.registerAdapter('simple_util', 'util');
        var cn2 = new HexConnector();
        cn2.registerAdapter('own_util', __dirname + '/test-adapters/fake-util');

        assert.equal('object', typeof cn.adapters.simple_util);
        assert.equal('undefined', typeof cn.adapters.own_util);

        assert.equal('object', typeof cn2.adapters.own_util);
        assert.equal('undefined', typeof cn2.adapters.simple_util);
    });

  });

describe('_set _get method', function () {

    beforeEach(function () {
        cn = new HexConnector();
    });

    it('should _set and _get value', function () {
        cn._set('key1', 'value1');
        cn._set('key2', ['value2', 'value3']);

        assert.equal('value1', cn._get('key1'));
        assert.deepEqual(['value2', 'value3'], cn._get('key2'));
    });

    it('should _get empty value', function () {
        assert.equal(undefined, cn._get('key1'));
    });

  });

});