//
// An exemplary headless controller to handle client site API actions. Users can either extend this module by adding more functionality to it, or create their own based on this code.
//
// **Usage**
//
// 1. Must override properties  (at least `moduleId`) of a **RestController** (*/pulsr/restController.js*).
// 2. Optionally can provide `GET`, `POST`, `DELETE`, etc. properties like `get-actions` shown above.
//     - When a `GET` request for */api/someGetAction* is arrived, the **RestController** will check if `get-actions` property exists. If it exists, it checks whether or not `someGetAction` is defined in `get-actions`. If it does, it calls the function assigned to that action to handle the request.
//     - In case no action is requested, eg. */api* with no action specified, the **default** action will be executed. If no default action is provided, 405 Method Not Allowed response is returned.
//
// **Requesting**
//
// - **/api**: will run the **default** action as no action is specified.
// - **/api/someGetAction**: will run **someGetAction**.
//
define(['restController', 'module', 'conf'], function(RestController, module, conf) {
    return RestController.override({
        moduleId: module.id,
        // This controller will respond to `GET` requests for those actions only which are indicated in this hash.
        'get-actions': {
            // A default action if no action is specified.
            default: function (request, response) {
                // As a sample response return this API and action info.
                response.end(JSON.stringify({
                    controller: 'api',
                    method: 'GET',
                    action: 'default',
                    status: 'success'
                }));
            },
            // Some other API called from a client.
            someGetAction: function (request, response) {
                // For example, first make sure this request is generated from our own site.
                if (request.headers && request.headers['host'] && request.headers['host'].indexOf(conf.get('app.domains.www')) == 0) {
                    // As a sample response return this API and action info.
                    response.end(JSON.stringify({
                        controller: 'api',
                        method: 'GET',
                        action: 'someGetAction',
                        status: 'success'
                    }));
                }
                else{
                    // Otherwise, it's prohibited
                    response.statusCode = 403;
                    response.end();
                }
            }
            // Other GET actions can be added here.
        }
        // Other HTTP actions can be added here.
    });
});