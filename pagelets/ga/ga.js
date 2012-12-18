// ga.js
// Displays Google Analytics Code
define(['pagelet', 'underscore', 'fs', 'path', 'module', 'conf', 'handlebars', 'fileCache'], function(Pagelet, _, fs, path, module, conf, Handlebars, fileCache) {
    var pagelet = new Pagelet();

    return _.extend(pagelet, {
        moduleUri: module.uri,
        run: function (display) {
            var pageletLayoutPath = path.join(this.dir, this.dirName + conf.file.extensions.template);
            // get the pagelet layout
            fileCache.layouts.get(pageletLayoutPath, function (err, data) {
                if (err) {
                    console.log('Could not read ' + this.dir + ' pagelet.');
                }
                else{
                    var template = Handlebars.compile(data);

                    data = template({
                        gaCode: conf.googleAnalytics.code,
                        domain: conf.googleAnalytics.domain
                    });
                }

                display(data);
            });
        }
    });
});