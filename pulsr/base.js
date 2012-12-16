define(['fs', 'handlebars', 'conf', 'requirejs', 'module', 'path', 'async'], function(fs, Handlebars, conf, requirejs, module, path, async) {
    var views = conf.dir.views,
        templateExtension = conf.file.extensions.template,
        mainLayout = path.join(views, conf.file.mainLayout + templateExtension);

    return function () {
        this.title = '';
        this.moduleId = module.id;
        this.pagelets = [];
        this.handle = function (request, response) {
			var controller = this;

            fs.readFile(mainLayout, 'utf8', function (err, data) {
                if (err) {
                    requirejs(['error_handler'], function(error_handler){
                        error_handler.handle(request, response, err);
                    });
                }
                else {
                    if (!controller.layout) {
                        controller.layout = conf.file.defaultPageLayout;
                    }

                    var layout = Handlebars.compile(data),
                        controllerLayout = path.join(views, controller.layout + templateExtension);

                    fs.readFile(controllerLayout, 'utf8', function (err, data) {
                        if (err) {
                            requirejs(['error_handler'], function(error_handler){
                                error_handler.handle(request, response, err);
                            });
                        }
                        else {
                            var body = Handlebars.compile(data),
                                headerSent = false,
                                cssStyles = '',
                                renderPagelet = function(info, done) {
                                    var pageletPath = path.join(conf.dir.pagelets, info.name, info.name),
                                        sendChunk = function (data, more) {
                                            if (!headerSent){
                                                headerSent = true;

                                                // if data has been specifically set to FALSE and sent
                                                // it means the requested content hasn't been found
                                                // which indicates to send 404 error code.
                                                if (data === false) {
                                                    response.statusCode = 404;
                                                }

                                                response.write(layout);
                                            }

                                            if (data) {
                                                response.write(data);
                                            }

                                            if (!more) {
                                                // now run sub-pagelets if any
                                                if (info.pagelets && info.pagelets.length) {
                                                    async.forEach(info.pagelets, renderPagelet, function (err) {
                                                        done();
                                                    });
                                                }
                                                else{
                                                    done();
                                                }
                                            }
                                        };

                                    requirejs([pageletPath], function(pagelet) {
                                        pagelet.options = info.options;
                                        pagelet.run(sendChunk, request, controller);
                                    });
                                };

                            // if this controller needs additional CSS styles
                            // add them to the template
                            if (controller.css) {
                                controller.css.forEach(function (file) {
                                    cssStyles += '<link rel="stylesheet" href="//' +
                                        conf.app.domains.static + '/css/' + file + '">';
                                });
                            }

                            layout = layout({
                                title: (typeof controller.title === 'function' ? controller.title(request) : controller.title),
                                staticDomain: conf.app.domains.static,
                                cssStyles: cssStyles,
                                body: body()
                            });

                            // Since we can't know beforehand whether 404 error code
                            // will be raise or not, it's not correct to send 200
                            // HTTP code at this moment.
                            response.setHeader('Content-Type', 'text/html; charset=UTF-8');
                            response.setHeader('Transfer-Encoding', 'chunked');

                            function endResponse(err) {
                                response.end('</body></html>');
                            }

                            if (controller.pagelets.length > 0) {
                                // TODO:
                                // set a timeout configuration which will
                                // monitor the pagelets loading. In case some
                                // pagelets do not respond withing the timeout
                                // period, the base controller (this file)
                                // must end the request.
                                async.forEach(controller.pagelets, renderPagelet, endResponse);
                            }
                            else{
                                response.write(layout);
                                endResponse();
                            }
                        }
                    });
                }
            });
		};
	};
});