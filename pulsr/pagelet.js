// pagelet.js
// Base pagelet module. Always instantiate this object.
// Usage: var pagelet = new Pagelet;
define(['module', 'path', 'conf'], function(module, path, conf) {
    return function () {
        this.moduleUri = module.uri;
        this.run = function (display) {
            display();
        };

        this.__defineGetter__('dir', function () {
            return path.resolve(path.dirname(this.moduleUri));
        });

        this.__defineGetter__('dirName', function () {
            return path.basename(this.moduleUri, '.js');
        });

        this.__defineGetter__('fullPath', function () {
            return path.join(this.dir, this.dirName + conf.get('file.extensions.template'));
        });
    };
});