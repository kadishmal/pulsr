/*
 cookies.js
 A module to get and set cookies.
 */
define(function() {
    return {
        // init() function will create .cookies object in request
        init: function (request, response) {
            request.cookies = {
                data: {},
                set: function (key, val) {
                    response.setHeader("Set-Cookie", key + '=' + val);
                    request.cookies.data[key] = val;
                },
                get: function (key) {
                    return this.data[key];
                }
            };

            if (request && request.headers.cookie) {
                request.headers.cookie.split(';').forEach(function (cookie) {
                    var ix = cookie.indexOf('='),
                        ckey = cookie.substring(0, ix).trim(),
                        cval = cookie.substring(ix + 1).trim();

                    request.cookies.data[ckey] = cval;
                });
            }
        }
    };
});