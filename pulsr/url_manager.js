define(['url_patterns', 'requirejs', 'conf', 'path', 'session', 'error_handler', 'url'], function (url_patterns, requirejs, conf, path, session, error_handler, url) {
    var regExpStore = {};

    for (var pattern in url_patterns) {
        regExpStore[pattern] = new RegExp('^' + pattern + '$');
    }

    return function(request, response) {
        var match, pulsrController;

        function callback(controller) {
            // start session here for all user defined controllers
            // pulsr fileManager controller should not set any
            // session information for static resources.
            // All cookies for static resources should be ignored.
            session.start(request, response);
            controller.handle(request, response);
        }

        function errback(err) {
            // this function is called when no user defined controller
            // is found. In such case it falls back and searches among
            // Pulsr's controller.
            // No Pulsr controller is called here except for fileHandler
            // which ignores cookies and should not set any session data.
            requirejs([pulsrController], function (controller) {
                controller.handle(request, response);
            }, function (err) {
                console.log(err);
                // Internal Server Error. This should not have happened
                // as fileHandler controller MUST BE in Pulsr.
                error_handler.handle(request, response, {errno: 500});
            });
        }

        request.body = '';
        // retrieve the request data in one tick.
        request.on('data', function (chunk) {
            request.body += chunk;

            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            // Also checking the domain would be good
            if (request.body.length > 1e6) {
                request.connection.destroy();
                // TODO: we may temporarily add to a blacklist
            }
        });
        // once all data has been received from the client,
        // handle the request.
        request.on('end', function () {
            for (var pattern in regExpStore) {
                if ((match = regExpStore[pattern].exec(request.url))) {
                    var controllerPath = path.join(conf.dir.controllers, url_patterns[pattern]);

                    pulsrController = url_patterns[pattern];
                    request.params = match;

                    // JSlint doesn't like when functions are defined inside for loops,
                    // so I'm taking these functions out.
                    requirejs([controllerPath], callback, errback);

                    // break the loop since we've already found the first match
                    return false;
                }
            }
        });
	};
});