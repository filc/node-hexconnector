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

    it('should register an own module with init method and null config', function () {
        cn.registerAdapter('own_util', __dirname + '/test-adapters/fake-util');
        assert.equal(true, cn.adapters.own_util.initialized);
        assert.equal(true, cn.adapters.own_util.initializedWithConfig);
        assert.deepEqual({}, cn.adapters.own_util.config);
    });

    it('should register an own module with init method but not calling it', function () {
        cn.registerAdapter('own_util', __dirname + '/test-adapters/fake-util', {k1: 'v1'}, true);
        assert.equal(false, cn.adapters.own_util.initialized);
        assert.equal(false, cn.adapters.own_util.initializedWithConfig);
        assert.deepEqual(null, cn.adapters.own_util.config);
    });

    it('should register more module from the same library', function () {
        cn.registerAdapter('own_util', __dirname + '/test-adapters/fake-util', {k1: 'v1'});
        cn.registerAdapter('own_util_2', __dirname + '/test-adapters/fake-util', {k1: 'v2'});

        assert.equal(true, cn.adapters.own_util.initialized);
        assert.equal(true, cn.adapters.own_util.initializedWithConfig);
        assert.deepEqual({k1: 'v1'}, cn.adapters.own_util.config);

        assert.equal(true, cn.adapters.own_util_2.initialized);
        assert.equal(true, cn.adapters.own_util_2.initializedWithConfig);
        assert.deepEqual({k1: 'v2'}, cn.adapters.own_util_2.config);
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

    it('should register an object as a library', function () {
        cn.registerAdapter('objLib', {
            testVar: 'var ok',
            testFunc: function () { return 'OK'; }
        });

        assert.equal('var ok', cn.adapters.objLib.testVar);
        assert.equal('OK', cn.adapters.objLib.testFunc());
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

  describe('getAdapter method', function () {

    beforeEach(function () {
        cn = new HexConnector();
    });

    it('should return null when getting a non-existing adapter', function () {
        assert.equal(null, cn.getAdapter('non-existing'));
    });

    it('should return with the adapter with lazy init', function () {
      cn.registerAdapter('own_util', __dirname + '/test-adapters/fake-util', null, true);

      assert.equal(false, cn.adapters.own_util.initialized);
      assert.equal(false, cn.adapters.own_util.initializedWithConfig);
      assert.deepEqual(null, cn.adapters.own_util.config);

      assert.equal(true, cn.getAdapter('own_util').initialized);
      assert.equal(true, cn.getAdapter('own_util').initializedWithConfig);
      assert.deepEqual({}, cn.getAdapter('own_util').config);
    });

    it('should return with the adapter with lazy init and adapter config', function () {
      cn.registerAdapter('own_util', __dirname + '/test-adapters/fake-util', {k1: 'v1'}, true);

      assert.equal(false, cn.adapters.own_util.initialized);
      assert.equal(false, cn.adapters.own_util.initializedWithConfig);
      assert.deepEqual(null, cn.adapters.own_util.config);

      assert.equal(true, cn.getAdapter('own_util').initialized);
      assert.equal(true, cn.getAdapter('own_util').initializedWithConfig);
      assert.deepEqual({k1: 'v1'}, cn.getAdapter('own_util').config);
    });
  });

});
