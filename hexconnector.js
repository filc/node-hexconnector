var HexConnector = function () {

    this.adapters = {};
    this.container = {};

    this.registerAdapter = function (port, adapter, config) {
        if (adapter instanceof Object) {
            this.adapters[port] = adapter;
        } else {
            this.adapters[port] = require(adapter);
        }

        if (typeof this.adapters[port].initAdapter === 'function') {
            this.adapters[port].initAdapter(this, config);
        }
    };

    this._set = function (k, v) {
        this.container[k] = v;
    };

    this._get = function (k) {
        return this.container[k];
    };
};

module.exports = HexConnector;