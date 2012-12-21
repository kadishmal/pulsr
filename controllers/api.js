/*
    api.js
    An exemplary headless controller module to perform client site API actions.
 */
define(['restController', 'module', 'conf'], function(RestController, module, conf) {
    return RestController.override({
        moduleId: module.id,
        'get-actions': {
            // this API is called from a client
            someGetAction: function (request, response) {
                // first make sure this request is generated from our own site.
                // user can check this if necessary
                if (request.headers && request.headers['host'] && request.headers['host'].indexOf(conf.app.domains.root) == 0) {
                    response.end(JSON.stringify({
                        controller: 'api',
                        method: 'GET',
                        action: 'someGetAction',
                        status: 'success'
                    }));
                }
                else{
                    // prohibited
                    response.statusCode = 403;
                    response.end();
                }
            }
        }
        // other actions can be added here
    });
});