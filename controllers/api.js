/*
    api.js
    A headless controller module to perform client site API actions.
 */
define(['underscore', 'base', 'module', 'cubrid', 'conf'], function(_, BaseController, module, CUBRID, conf) {
    var controller = new BaseController();

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    // TODO: check administrative privileges
    return _.extend(controller, {
        moduleId: module.id,
        handle: function (request, response) {
            var method = request.method.toLowerCase();

            if (!this.hasOwnProperty(method + '-actions')) {
                // Method Not Allowed
                response.statusCode = 405;
                response.end();
            }
            else{
                var action = request.params[1];

                if (!this[method + '-actions'].hasOwnProperty(action)) {
                    // Method Not Allowed
                    response.statusCode = 405;
                    response.end();
                }
                else{
                    this[method + '-actions'][action](request, response);
                }
            }
        },
        'get-actions': {
            // this API is called from client
            someGetAction: function (request, response) {
                // first make sure this request is generated from our own site
                if (request.headers && request.headers['host'] && request.headers['host'].indexOf(conf.app.domains.root) == 0) {
                    // handle the request
                }
                else{
                    // prohibited
                    response.statusCode = 403;
                    response.end();
                }
            }
        },
        'post-actions': {

        },
        'put-actions': {

        }
        // other actions
    });
});