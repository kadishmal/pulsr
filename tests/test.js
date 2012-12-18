var should = require("should"),
    requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'pulsr',
    nodeRequire: require
});

describe('Pulsr', function (){
    describe('fileHandler', function (){
        describe('js.js', function (){
            it('should return 200 statusCode for js/mainClient.js request within 10s', function (done){
                this.timeout(10000);

                requirejs(['conf', 'http'], function (conf, http) {
                    http.get('http://' + conf.app.domains.static + '/js/mainClient.js', function (response) {
                        response.should.have.status(200);
                        done();
                    });
                });
            });
        });
    });
});