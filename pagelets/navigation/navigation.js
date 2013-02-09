// navigation.js
// Displays main menu
define(['pagelet', 'underscore', 'fs', 'path', 'module', 'conf', 'handlebars'], function(Pagelet, _, fs, path, module, conf, Handlebars) {
    var menuFile = path.join(conf.root_dir, path.dirname(module.uri), 'data');

    Handlebars.registerHelper('link', function(text, url) {
        text = Handlebars.Utils.escapeExpression(text);
        url  = Handlebars.Utils.escapeExpression(url);

        var result = '<a href="' + url + '">' + text + '</a>';

        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('list', function(items, options) {
        var out = '';

        for(var i = 0, l = items.length; i < l; i++) {
            out = out + '<li' + (items[i].active ? ' class="active"' : '') + '>' + options.fn(items[i]) + '</li>';
        }

        return out;
    });

    var pagelet = new Pagelet;

    return _.extend(pagelet, {
        moduleUri: module.uri,
        run: function (display, request, controller, options) {
            var _this = this;

            fs.readFile(path.join(_this.dir, _this.dirName + conf.file.extensions.template), 'utf8', function (err, data) {
                if (err) {
                    console.log('Could not read ' + _this.dir + ' pagelet.');
                    display();
                }
                else{
                    var template = Handlebars.compile(data);

                    requirejs([menuFile], function(menus) {
                        var activeMenus = _.map(menus, function (link) {
                            var activeLink = _.clone(link);

                            if (request.url == activeLink.href) {
                                activeLink.active = true;
                            }

                            return activeLink;
                        });

                        display(template({
                            menus: activeMenus,
                            targetId: options.targetId,
                            class:  options.class
                        }));
                    });
                }
            });
        }
    });
});