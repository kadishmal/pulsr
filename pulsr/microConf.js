// A micro Node.js module to handle in-memory hierarchical configuration.
// The module also allows to define getter functions as parameters.
define(function() {
	return new function () {
        var splitCharsRE = /[:.]/;

        this.store = new function () {};

        function _set(store, key, value) {
            if (typeof key == 'object') {
                var obj = key;

                for (var prop in obj) {
                    _set(store, prop, obj[prop]);
                }
            }
            else{
                if (typeof value === 'object') {
                    store[key] = new function () {};

                    var keyStore = store[key];

                    for (var prop in value) {
                        var val = value[prop],
                            valType = typeof val;

                        if (valType === 'function') {
                            keyStore.__defineGetter__(prop, val);
                        }
                        else if (valType === 'object'){
                            keyStore[prop] = new function () {};

                            for (var p in val) {
                                _set(keyStore[prop], p, val[p]);
                            }
                        }
                        else{
                            keyStore[prop] = val;
                        }
                    }
                }
                else if (typeof value === 'function') {
                    store.__defineGetter__(key, value);
                }
                else{
                    store[key] = value;
                }
            }
        };

        this.set = function (key, value) {
            var keyType = typeof key;

            if (keyType !== 'undefined'){
                // TODO: How about a real number (eg. 123.75) wrapped in quotes?
                if (keyType === 'string') {
                    var props = key.split(splitCharsRE),
                        store = this.store;

                    for (var i = 0; i < props.length - 1; ++i) {
                        if (store.hasOwnProperty(props[i])) {
                            store = store[props[i]];
                        }
                        else{
                            store = store[props[i]] = {};
                        }
                    }

                    _set(store, props.pop(), value);
                }
                else{
                    _set(this.store, key, value);
                }
            }
        };

        this.get = function (key) {
            var props = key.split(splitCharsRE), obj;

            while (key = props.shift()) {
                if (!obj) {
                    obj = this.store[key];
                }
                else{
                    obj = obj[key];
                }
            }

            if (typeof obj === 'function') {
                return obj();
            }

            return obj;
        };
    };
});