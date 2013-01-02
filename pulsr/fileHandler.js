define(['conf', 'requirejs', 'mime', 'path', 'fs', 'fileCache', 'error_handler', 'underscore'], function(conf, requirejs, mime, path, fs, fileCache, error_handler, _) {
    // A RegEx to chech whether the requested file is located in one of the allowed directories.
    var allowedDirsRE = new RegExp("^/(" + conf.file.allowedDirs.join("|") + ")/.*"),
        allowedMimesRE = new RegExp("^(" + _.toArray(conf.file.allowedMimes).join("|") + ")");

    mime.define({
        'text/css': ['less'],
        'text/html': ['hb'],
        'text/plain': ['md']
    });

	return {
		title: '',
		pageletCount: 1,
		handle: function(request, response) {
            // Is this file located in the allowed directory?
            if (allowedDirsRE.test(request.url)) {
                var contentType = mime.lookup(request.url);
                // Is this type of file allowed to be served?
                if (allowedMimesRE.test(contentType)) {
                    // 1. Make sure user doesn't try to access restricted areas
                    // using "../" relative path.
                    // 2. Prepend ".", indicating that the file lookup should be
                    // relative to the app root directory.
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
                    // Service this type of file is restricted.
                    error_handler.handle(request, response, {errno: 403});
                }
            }
            else{
                // Access to a restricted directory is forbidden.
                error_handler.handle(request, response, {errno: 403});
            }
		}
	};
});