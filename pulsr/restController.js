/*
    restController.js
    A headless, RESTful controller module to handle client side API actions.
 */
define(['baseController', 'module'], function(BaseController, module) {
    return BaseController.override({
        moduleId: module.id,
        handle: function (request, response) {
            var method = request.method.toLowerCase();

            if (!this.hasOwnProperty(method + '-actions')) {
                // Method Not Allowed
                response.statusCode = 405;
                response.end();
            }
            else{
                var action = request.params[2];

                if (!this[method + '-actions'].hasOwnProperty(action)) {
                    // Method Not Allowed
                    response.statusCode = 405;
                    response.end();
                }
                else{
                    this[method + '-actions'][action](request, response);
                }
            }
        }
    });
});