// A micro Node.js module to handle in-memory hierarchical configuration.
// The module also allows to define getter functions as values, not just
// literal values.
// ## Usage:
//     conf.set(object);
//     conf.set(string_key, literal_value);
//     conf.set(string_key, object_value);
//     conf.get(string_key);
define(function() {
	return new function () {
        var splitCharsRE = /[:.]/,
            cache = {};

        this.store = new function () {};

        function _set(store, key, value, chainKey) {
            if (typeof key == 'object') {
                var obj = key;

                for (var prop in obj) {
                    _set(store, prop, obj[prop], chainKey);
                }
            }
            else{
                chainKey += (chainKey.length ? '.' : '') + key;

                if (typeof value === 'object') {
                    var keyStore = store[key] = new function () {};
                    cache[chainKey] = keyStore;

                    for (var prop in value) {
                        _set(keyStore, prop, value[prop], chainKey);
                    }
                }
                else if (typeof value === 'function') {
                    store.__defineGetter__(key, value);
                    cache[chainKey] = value;
                }
                else{
                    cache[chainKey] = store[key] = value;
                }
            }
        };

        this.set = function (key, value) {
            var keyType = typeof key;

            if (keyType !== 'undefined'){
                // TODO: How about a real number (eg. 123.75) wrapped in quotes?
                if (keyType === 'string') {
                    var props = key.split(splitCharsRE),
                        store = this.store,
                        chainKey = '';

                    for (var i = 0; i < props.length - 1; ++i) {
                        chainKey += (chainKey.length ? '.' : '') + props[i];

                        if (store.hasOwnProperty(props[i])) {
                            store = store[props[i]];
                        }
                        else{
                            cache[chainKey] = store = store[props[i]] = {};
                        }
                    }

                    _set(store, props.pop(), value, chainKey);
                }
                else{
                    // Pass an empty chainKey for an object.
                    _set(this.store, key, value, '');
                }
            }
        };

        this.get = function (key) {
            if (typeof cache[key] === 'function') {
                return cache[key]();
            }

            return cache[key];
        };
    };
});