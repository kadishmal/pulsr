// navigation.js
// Displays main menu
define(['pagelet', 'underscore', 'path', 'module', 'conf', 'handlebars', 'requirejs', 'fileCache'], function(Pagelet, _, path, module, conf, Handlebars, requirejs, fileCache) {
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

    var pagelet = new Pagelet();

    return _.extend(pagelet, {
        moduleUri: module.uri,
        run: function (display, request, controller, options) {
            var _this = this;

            fileCache.templates.get(_this.fullPath, function (err, template) {
                if (err) {
                    console.log('Could not read ' + _this.dir + ' pagelet.');
                    display();
                }
                else{
                    // Load the specified menu, or the default 'user' menu.
                    var menuFile = path.join(conf.get('path.root_dir'), path.dirname(module.uri), options.data ? options.data : 'user');

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
                            targetId: options.targetId ? options.targetId : _this.dirName,
                            class:  options.class
                        }));
                    });
                }
            });
        }
    });
});