var should = require("should"),
    requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'pulsr',
    nodeRequire: require
});

describe('Pulsr', function (){
    describe('fileHandler', function (){
        describe('js.js', function (){
            it('should return 200 statusCode for all JS file requests within 20s', function (done){
                // set timeout to 20s
                this.timeout(20000);

                requirejs(['async', 'fs', 'path', 'module', 'http', 'conf'], function (async, fs, path, module, http, conf) {
                    // a list of directories to search for JS files
                    var jsDirs = ['js', 'js/libs', 'js/libs/bootstrap', 'js/libs/foundation'];

                    function traverseDir(dirName, done) {
                        var dirPath = path.join(path.dirname(path.resolve(module.uri)), '../', dirName);

                        function requestFile(fileName, done) {
                            if (/.+\.js/.test(fileName)) {
                                var filePath = path.join(dirPath, fileName);

                                fs.stat(filePath, function (err, stat) {
                                    if (err) {
                                        throw err;
                                    }
                                    else if (stat.isFile()){
                                        http.get('http://' + conf.app.domains.static + '/' + dirName + '/' + fileName, function (response) {
                                            response.should.have.status(200);
                                            done();
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

                    async.forEach(jsDirs, traverseDir, function (err) {
                        done();
                    });
                });
            });

            it('should return 404 statusCode for non-existing JS file requests within 20s', function (done){
                // set timeout to 20s
                this.timeout(20000);

                requirejs(['async', 'fs', 'path', 'module', 'http', 'conf'], function (async, fs, path, module, http, conf) {
                    // a list of non-existing JS files
                    var jsFiles = ['js/apple.js', 'js/banana.js', 'js/libs/bootstrap/jake.js'];

                    function requestFile(fileName, done) {
                        var filePath = path.join(path.dirname(path.resolve(module.uri)), '../', fileName);

                        var request = http.get('http://' + conf.app.domains.static + '/' + fileName, function (response) {
                            response.should.have.status(404);
                            done();
                        });
                    }

                    async.forEach(jsFiles, requestFile, function (err) {
                        done();
                    });
                });
            });
        });
    });
});