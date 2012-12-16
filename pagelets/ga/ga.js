// ga.js
// Displays Google Analytics Code
define(['pagelet', 'underscore', 'fs', 'path', 'module', 'conf', 'handlebars'], function(Pagelet, _, fs, path, module, conf, Handlebars) {
    var pagelet = new Pagelet();

    return _.extend(pagelet, {
        moduleUri: module.uri,
        run: function (display) {
            // TODO: No need to read template files all the time in pagelets.
            // If not changed frequently, better to take it out of this function
            fs.readFile(path.join(this.dir, this.dirName + conf.file.extensions.template), 'utf8', function (err, data) {
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