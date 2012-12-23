/*
    # api.js

    An exemplary headless controller module to handle client site API actions.

    **Usage:**

    - ** /api**: will run the **default** action as no action is specified.
    - ** /api/someGetAction**: will run **someGetAction**.
 */
define(['restController', 'module', 'conf'], function(RestController, module, conf) {
    return RestController.override({
        moduleId: module.id,
        'get-actions': {
            // a default action if no action is specified
            default: function (request, response) {
                // as a sample response return this API and action info
                response.end(JSON.stringify({
                    controller: 'api',
                    method: 'GET',
                    action: 'default',
                    status: 'success'
                }));
            },
            // some other API called from a client
            someGetAction: function (request, response) {
                // for example, first make sure this request is generated from our own site.
                if (request.headers && request.headers['host'] && request.headers['host'].indexOf(conf.app.domains.root) == 0) {
                    // as a sample response return this API and action info
                    response.end(JSON.stringify({
                        controller: 'api',
                        method: 'GET',
                        action: 'someGetAction',
                        status: 'success'
                    }));
                }
                else{
                    // otherwise, it's prohibited
                    response.statusCode = 403;
                    response.end();
                }
            }
            // other GET actions can be added here
        }
        // other actions can be added here
    });
});