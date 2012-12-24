var should = require("should"),
    requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'pulsr',
    nodeRequire: require
});

describe('Pulsr', function (){
    describe('restController', function (){
        it('should return 200 statusCode and a JSON object as a body for /api', function (done){
            // set timeout to 15s
            this.timeout(15000);

            requirejs(['http', 'conf'], function (http, conf) {
                http.get('http://' + conf.app.domains.root + '/api', function (response) {
                    response.should.have.status(200);

                    var body = '';

                    response.on('data', function (chunk) {
                        body += chunk;
                    });

                    response.on('end', function () {
                        body.should.equal(JSON.stringify({
                            controller: 'api',
                            method: 'GET',
                            action: 'default',
                            status: 'success'
                        }));

                        done();
                    });
                });
            });
        });

        it('should return 200 statusCode and a JSON object as a body for /api/someGetAction', function (done){
            // set timeout to 15s
            this.timeout(15000);

            requirejs(['http', 'conf'], function (http, conf) {
                http.get('http://' + conf.app.domains.root + '/api/someGetAction', function (response) {
                    response.should.have.status(200);

                    var body = '';

                    response.on('data', function (chunk) {
                        body += chunk;
                    });

                    response.on('end', function () {
                        body.should.equal(JSON.stringify({
                            controller: 'api',
                            method: 'GET',
                            action: 'someGetAction',
                            status: 'success'
                        }));

                        done();
                    });
                });
            });
        });
    });
});