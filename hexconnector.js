var HexConnector = function () {
    var self = this;
    var initializedAdapters = {};
    var adapterConfigs = {};

    this.initialised = false;
    this.adapters = {};
    this.container = {};

    function _loadAdapter(port, adapter) {
        if (adapter instanceof Object) {
            self.adapters[port] = adapter;
        } else {
            delete require.cache[require.resolve(adapter)];
            self.adapters[port] = require(adapter);
        }
    }

    function _initAdapter(port) {
        self.adapters[port].initAdapter(self, adapterConfigs[port]);
        initializedAdapters[port] = true;
    }

    this._set = function (k, v) {
        self.container[k] = v;
    };

    this._get = function (k) {
        return self.container[k];
    };

    this.init = function (config) {
        if (self.initialized) {
            return Error('Sorry already initialized!');
        }
        self._set('app_config', config);

        Object.keys(config.adapters).forEach(function (port) {
            const adapterConfig = config.adapters[port];
            initializedAdapters[port] = false;
            adapterConfigs[port] = config[adapterConfig.config] || {};
            _loadAdapter(port, adapterConfig.adapter);
        });
        self.initialized = true;
    };

    this.registerAdapter = function (port, adapter, config, withoutInit) {
        initializedAdapters[port] = false;
        adapterConfigs[port] = config || {};

        _loadAdapter(port, adapter);

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
    };
};

module.exports = HexConnector;
