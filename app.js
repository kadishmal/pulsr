var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'pulsr',
    nodeRequire: require
});

requirejs(['conf', 'server'], function(conf, app) {
    app.server.listen(conf.port, null);
    console.log('App started on port ' + conf.port);
});
