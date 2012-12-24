define(['conf', 'requirejs', 'mime', 'path', 'fs', 'fileCache', 'error_handler'], function(conf, requirejs, mime, path, fs, fileCache, error_handler) {
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
            // Is this type of file allowed to be served?
			if (conf.file.allowedMimes.indexOf(contentType) > -1) {
                // Make sure user doesn't try to access restricted areas
                // using "../" relative path. Then prepend ".", indicating
                // that the file lookup should be relative to the app root
                // directory.
                var filePath = path.join('.', request.url.replace(/\.\.\//g, '')),
                    fileExtension = path.extname(filePath);
                // If no file extension is found, this should be a directory,
                // and directory lookup is not permitted in Pulsr.
                if (!fileExtension) {
                    error_handler.handle(request, response, {errno: 403});
                }
                else{
                    var fileHandlerPath = path.resolve(path.join(conf.app.engine, 'fileHandlers', fileExtension.replace(/\./, '') + '.js'));

                    fs.exists(fileHandlerPath, function (exists) {
                        if (exists) {
                            requirejs([fileHandlerPath], function(processFile){
                                processFile(request, response, conf.file.handlerOptions[fileExtension]);
                            });
                        }
                        else{
                            fileCache.stats.get(filePath, function (err, stat) {
                                if (err) {
                                    error_handler.handle(request, response, err);
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
                            });
                        }
                    });
                }
			}
			else{
                error_handler.handle(request, response, {errno: 403});
			}
		}
	};
});