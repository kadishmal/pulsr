var should = require("should"),
    requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'pulsr',
    nodeRequire: require
});

describe('Pulsr', function (){
    describe('fileHandler', function (){
        it('should return 200 statusCode for image file request within 20s', function (done){
            // set timeout to 20s
            this.timeout(20000);

            requirejs(['async', 'fs', 'path', 'module', 'http', 'conf'], function (async, fs, path, module, http, conf) {
                var imgDirs = ['img'];

                function traverseDir(dirName, done) {
                    var dirPath = path.join(path.dirname(path.resolve(module.uri)), '../', dirName);

                    function requestFile(fileName, done) {
                        if (/.+\.(png|jpg|gif)/.test(fileName)) {
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

                async.forEach(imgDirs, traverseDir, function (err) {
                    done();
                });
            });
        });

        it('should return 404 statusCode for non-existing image file requests within 20s', function (done){
            // set timeout to 20s
            this.timeout(20000);

            requirejs(['async', 'http', 'conf'], function (async, http, conf) {
                var imgFiles = ['img/apple.png', 'img/banana.png', 'img/jake.gif', 'img/zoo.jpg'];

                function requestFile(filePath, done) {
                    http.get('http://' + conf.app.domains.static + '/' + filePath, function (response) {
                        response.should.have.status(404);
                        done();
                    });
                }

                async.forEach(imgFiles, requestFile, function (err) {
                    done();
                });
            });
        });

        it('should return 403 statusCode for direct directory access requests within 20s', function (done){
            // set timeout to 20s
            this.timeout(20000);

            requirejs(['async', 'http', 'conf'], function (async, http, conf) {
                var restrictedDirs = ['img', 'js', 'less', 'pulsr', 'controller', 'nonExistingDir', 'js/bootstrap', 'less/foundation', 'assets'];

                function requestDir(dirName, done) {
                    http.get('http://' + conf.app.domains.static + '/' + dirName, function (response) {
                        response.should.have.status(403);
                        done();
                    });
                }

                async.forEach(restrictedDirs, requestDir, function (err) {
                    done();
                });
            });
        });

        it('should return 403 statusCode for restricted directory access requests within 20s', function (done){
            // set timeout to 20s
            this.timeout(20000);

            requirejs(['async', 'http', 'conf'], function (async, http, conf) {
                var restrictedDirs = ['pulsr/conf.js', 'pagelets/ga/ga.js', 'contents/404.md', 'controllers/api.js', 'node_modules/bin/docco', 'nonExistingDir', 'tests/baseController.js', 'views/layout.hb', '../aboveRootNonExistDir', 'app.js', '.travis.yml', '.gitignore', 'Makefile', 'package.json', 'assets'];

                function requestDir(dirName, done) {
                    http.get('http://' + conf.app.domains.static + '/' + dirName, function (response) {
                        response.should.have.status(403);
                        done();
                    });
                }

                async.forEach(restrictedDirs, requestDir, function (err) {
                    done();
                });
            });
        });


        it('should return 200 statusCode for favicon requests located in the root directory.', function (done){
            // set timeout to 20s
            this.timeout(20000);

            requirejs(['async', 'http', 'conf'], function (async, http, conf) {
                var favicons = ['favicon.ico', 'apple-touch-icon-57x57-precomposed.png'];

                function sendRequest(filePath, done) {
                    http.get('http://' + conf.app.domains.static + '/' + filePath, function (response) {
                        response.should.have.status(200);
                        done();
                    });
                }

                async.forEach(favicons, sendRequest, function (err) {
                    console.log('favicon is done');
                    done();
                });
            });
        });

        it('should return 200 statusCode for plain text requests located in the root directory.', function (done){
            // set timeout to 20s
            this.timeout(20000);

            requirejs(['async', 'http', 'conf'], function (async, http, conf) {
                var favicons = ['robots.txt', 'humans.txt', 'README.md', 'CHANGELOG.md'];

                function sendRequest(filePath, done) {
                    http.get('http://' + conf.app.domains.static + '/' + filePath, function (response) {
                        response.should.have.status(200);
                        done();
                    });
                }

                async.forEach(favicons, sendRequest, function (err) {
                    console.log('favicon is done');
                    done();
                });
            });
        });
    });
});