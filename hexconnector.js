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
            self.adapters[port] = adapter;
        } else {
            delete require.cache[require.resolve(adapter)]
            self.adapters[port] = require(adapter);
        }

        if (!withoutInit && typeof self.adapters[port].initAdapter === 'function') {
            _initAdapter(port);
        }
    };

    this.getAdapter = function (port) {
        var adapter = self.adapters[port];

        if (adapter && !initializedAdapters[port] && typeof adapter.initAdapter === 'function') {
            _initAdapter(port);
        }

        return adapter;
    }

    this._set = function (k, v) {
        self.container[k] = v;
    };

    this._get = function (k) {
        return self.container[k];
    };

    function _initAdapter(port) {
        self.adapters[port].initAdapter(self, adapterConfigs[port]);
        initializedAdapters[port] = true;
    }
};

module.exports = HexConnector;
