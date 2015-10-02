'use strict';

var self = module.exports = {
    initialized: false,
    initializedWithConfig: false,
    config: null,

    initAdapter: function (connector, config) {
        self.initialized = true;
        self.config = config;

        if (self.config) {
            self.initializedWithConfig = true;
        }
    }
};