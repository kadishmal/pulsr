define(['conf', 'requirejs', 'mime', 'path', 'fs', 'fileCache'], function(conf, requirejs, mime, path, fs, fileCache) {
    mime.define({
        'text/css': ['less'],
        'text/html': ['hb'],
        'text/plain': ['md']
    });

	return {
		title: '',
		pageletCount: 1,
		handle: function(request, response) {
			var contentType = mime.lookup(request.url);

			if (conf.file.allowedMimes.indexOf(contentType) > -1) {
                // the request.url has the form of /js/main.js
                // since this script is being executed relative to
                // the root directory, we simply add '.' to
                // indicate the root directory.
				var filePath = path.join('.', request.url),
                    fileExtension = path.extname(filePath),
                    fileHandlerStatCallback = function (err, stat) {
                        if (err) {
                            requirejs(['error_handler'], function(error_handler){
                                error_handler.handle(request, response, err);
                            });
                        }
                        else {
                            var etag = stat.ino + '-' + stat.size + '-' + Date.parse(stat.mtime);
                            response.setHeader('Last-Modified', stat.mtime);

                            if (request.headers['if-none-match'] === etag) {
                                response.statusCode = 304;
                                response.end();
                            }
                            else {
                                response.setHeader('Content-Type', contentType);
                                response.setHeader('ETag', etag);
                                response.statusCode = 200;

                                fs.createReadStream(filePath).pipe(response);
                            }
                        }
                    },
                    fileHandlerPath = path.resolve(path.join(conf.app.engine, 'fileHandlers', fileExtension.replace(/\./, '') + '.js'));

                fs.exists(fileHandlerPath, function (exists) {
                    if (exists) {
                        requirejs([fileHandlerPath], function(processFile){
                            processFile(request, response, conf.file.handlerOptions[fileExtension]);
                        });
                    }
                    else{
                        fileCache.stats.get(filePath, fileHandlerStatCallback);
                    }
                });
			}
			else{
				requirejs(['error_handler'], function(error_handler){
					error_handler.handle(request, response, {errno: 403});
				});
			}
		}
	};
});