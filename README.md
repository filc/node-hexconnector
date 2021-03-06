# node-hexconnector

This package is used for storing any values or dependecies that any parts of the application might need.

## Installation

npm install node-hexconnector

## Get started

```
var HexConnector = require('node-hexconnector');
var cn = new HexConnector();
```

## Set and get values

```
cn._set('key', 'any kind of value');
var myValue = cn._get('key');
console.log(myValue);
```

## Register adapters

#### Register a simple object as an adapter


```
cn.registerAdapter('ownLib', {
    testFunc: function () {
        console.log('OK');
    }
});

cn.adapters.ownLib.testFunc();
```


#### Register a standard package as an adapter


```
cn.registerAdapter('myUtil', 'util');
cn.adapters.myUtil.isBoolean(true);
```

#### Register an own example adapter


Let's see our adapter (own.js)

```
var connector;
var config;

module.exports = {
    initAdapter: function (_connector, _config) {
        connector = _connector;
        config = _config;
    },

    getConfig: function() {
        return config;
    }
}
```

Now, let's see how to use it...

```
cn.registerAdapter('ownAdapter', './own');
var adapterConfig = cn.adapters.ownAdapter.getConfig();
console.log(adapterConfig);
```

... or register and use the adapters with **lazy initialization**...

```
cn.registerAdapter('ownAdapter', './own', {test_key: 'test value'}, true);
var adapter = cn.getAdapter('ownAdapter');
console.log(adapter.getConfig());
```
