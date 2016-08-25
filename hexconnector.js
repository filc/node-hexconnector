var HexConnector = function () {
    var self = this;

    var initializedAdapters = {};
    var adapterConfigs = {};

    this.adapters = {};
    this.container = {};

    this.registerAdapter = function (port, adapter, config, withoutInit) {
        initializedAdapters[port] = false;
        adapterConfigs[port] = config || {};

        if (adapter instanceof Object) {
            this.adapters[port] = adapter;
        } else {
            delete require.cache[require.resolve(adapter)]
            this.adapters[port] = require(adapter);
        }

        if (!withoutInit && typeof this.adapters[port].initAdapter === 'function') {
            _initAdapter(port);
        }
    };

    this.getAdapter = function (port) {
        var adapter = this.adapters[port];

        if (adapter && !initializedAdapters[port] && typeof adapter.initAdapter === 'function') {
            _initAdapter(port);
        }

        return adapter;
    }

    this._set = function (k, v) {
        this.container[k] = v;
    };

    this._get = function (k) {
        return this.container[k];
    };

    function _initAdapter(port) {
        self.adapters[port].initAdapter(this, adapterConfigs[port]);
        initializedAdapters[port] = true;
    }
};

module.exports = HexConnector;
