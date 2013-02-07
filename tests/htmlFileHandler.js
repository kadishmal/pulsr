var should = require("should"),
    requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'pulsr',
    nodeRequire: require
});

describe('Pulsr', function (){
    describe('htmlFileHandler', function (){
        it('should return 200 statusCode for HTML file request within 20s', function (done){
            // set timeout to 20s
            this.timeout(20000);

            requirejs(['async', 'fs', 'path', 'module', 'http', 'conf'], function (async, fs, path, module, http, conf) {
                var htmlDirs = ['docs'];

                function traverseDir(dirName, done) {
                    var dirPath = path.join(path.dirname(path.resolve(module.uri)), '../', dirName);

                    function requestFile(fileName, done) {
                        if (/.+\.(html)/.test(fileName)) {
                            var filePath = path.join(dirPath, fileName);

                            fs.stat(filePath, function (err, stat) {
                                if (err) {
                                    throw err;
                                }
                                else if (stat.isFile()){
                                    http.get('http://' + conf.app.domains.root + '/' + dirName + '/' + fileName, function (response) {
                                        response.should.have.status(200);
                                        response.should.be.html;
                                        response.should.have.header('vary', 'accept-encoding');
                                        response.headers.should.not.have.property('content-encoding');

                                        http.get({
                                            host: (conf.app.domains.root.split(':')[0]),
                                            path: '/' + dirName + '/' + fileName,
                                            port: 1337,
                                            headers: { 'accept-encoding': 'gzip' } },
                                        function (response) {
                                            response.should.have.status(200);
                                            response.should.be.html;
                                            response.should.have.header('content-encoding', 'gzip');
                                            response.should.have.header('vary', 'accept-encoding');

                                            done();
                                        });
                                    });
                                }
                                else{
                                    done();
                                }
                            });
                        }
                        else{
                            done();
                        }
                    }

                    fs.readdir(dirPath, function (err, files) {
                        if (err) {
                            throw err;
                        }
                        else{
                            async.forEach(files, requestFile, function (err) {
                                done();
                            });
                        }
                    });
                }

                async.forEach(htmlDirs, traverseDir, function (err) {
                    done();
                });
            });
        });

        it('should return 404 statusCode for non-existing HTML file requests within 20s', function (done){
            // set timeout to 20s
            this.timeout(20000);

            requirejs(['async', 'http', 'conf'], function (async, http, conf) {
                var htmlFiles = ['docs/zubazuba.html', 'docs/lambalamba.html'];

                function requestFile(filePath, done) {
                    http.get('http://' + conf.app.domains.static + '/' + filePath, function (response) {
                        response.should.have.status(404);
                        done();
                    });
                }

                async.forEach(htmlFiles, requestFile, function (err) {
                    done();
                });
            });
        });
    });
});