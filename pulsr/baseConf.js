define(['module', 'path', 'microConf'], function(module, path, conf) {
    var isProduction = (process.env.NODE_ENV == 'production');

    conf.set({
        app: {
            cache: {
                // Cache-Control in seconds
                maxage: (isProduction ?
                    // 1 week on production server for this time.
                    // ideally, it's recommended to cache for a year ahead
                    // or at least a month ahead.
                    // 1 week is acceptable by Google Page Speed as well as YSlow
                    60 * 60 * 24 * 7 :
                    // or 5 minutes on dev server
                    300),
                fileCache: {
                    stats: {
                        // Options passed directly to the internal lru cache
                        // indicating how many items to store in a fileCache.
                        max: 100,
                        // maxAge property for lru cache.
                        maxAge: function () {
                            return (isProduction ? conf.get('app.cache.fileCache.stats.maxAgeProduction') : conf.get('app.cache.fileCache.stats.maxAgeDev')) * 60 * 1000;
                        },
                        // Don't cache file stats in dev environment. For then set 1 second cache period.
                        // Setting 0 doesn't work, perhaps async-cache bug or expected behavior.
                        maxAgeDev: 1/60,
                        // In production cache file stats for 10 minutes.
                        maxAgeProduction: 10
                    },
                    layouts: {
                        // Options passed directly to the internal lru cache
                        // indicating how many items to store in a fileCache.
                        max: 100,
                        // maxAge property for lru cache.
                        maxAge: function () {
                            return (isProduction ? conf.get('app.cache.fileCache.layouts.maxAgeProduction') : conf.get('app.cache.fileCache.layouts.maxAgeDev')) * 60 * 1000;
                        },
                        // Don't cache file stats in dev environment. For then set 1 second cache period.
                        // Setting 0 doesn't work, perhaps async-cache bug or expected behavior.
                        maxAgeDev: 1/60,
                        // In production cache file stats for 10 minutes.
                        maxAgeProduction: 10
                    }
                }
            },
            engine: 'pulsr',
            domains: {
                production: 'pulsr.org',
                dev: 'pulsr.local',
                root: function () {
                    var app = conf.get('app');

                    return (isProduction ? app.domains.production : app.domains.dev + ':' + app.port);
                },
                static: function () {
                    return 'static.' + conf.get('app.domains.root');
                },
                www: function () {
                    return 'www.' + conf.get('app.domains.root');
                }
            },
            port: process.env.VMC_APP_PORT || 1337
        },
        // The database configurations can be defined as follows.
        db: {
            host: 'localhost',
            port: 33000,
            user: 'db_user',
            password: "passw",
            name: 'db_name'
        },
        file: {
            // Which directories can be looked up by users?
            // Used by fileHandler.js.
            allowedDirs: {
                '/docs': {
                    allowedMimes: function () {
                        return [conf.get('file.allowedMimes.html'), conf.get('file.allowedMimes.css')];
                    }
                },
                '/img': {
                    allowedMimes: function () {
                        return [conf.get('file.allowedMimes.gif'), conf.get('file.allowedMimes.png'), conf.get('file.allowedMimes.jpeg')];
                    }
                },
                '/js': {
                    allowedMimes: function () {
                        return [conf.get('file.allowedMimes.js')];
                    }
                },
                '/less': {
                    allowedMimes: function () {
                        return [conf.get('file.allowedMimes.css')];
                    }
                },
                // Allow access to only icon and plain text files from the root directory.
                '/': {
                    allowedMimes: function () {
                        return [conf.get('file.allowedMimes.icon'), conf.get('file.allowedMimes.png'), conf.get('file.allowedMimes.plain')];
                    }
                }
            },
            // Which kind of static files can be requested by a client?
            // Used by fileHandler.js.
            allowedMimes: {
                // CSS files
                css: 'text/css',
                // JavaScript files
                js: 'application/javascript',
                // icons
                icon: 'image/x-icon',
                // images
                gif: 'image/gif',
                png: 'image/png',
                jpeg: 'image/jpeg',
                // html files
                html: 'text/html',
                // plain text files
                plain: 'text/plain'
            },
            extensions: {
                // extension of template files
                template: '.hb',
                handlebars: '.hb',
                markdown: '.md',
                less: '.less',
                css: '.css',
                js: '.js',
                gzip: '.gz',
                html: '.html'
            },
            // default layout of a page
            defaultPageLayout: 'front-page',
            // the name of the main layout template file
            mainLayout: 'layout',
            // File handler options. Each file handler should be identified by the mime type
            // of files it handles. For example, *pulsr/fileHandlers/less.js* handles
            // requests for *.less* and *.css* files which both have mime type of **text/css**.
            // So this handlerOptions hash should have a `key = "text/css"`, and a hash object
            // as its value which represent options for that particular file handler.
            handlerOptions: {}
        },
        pagelets: {
            // These are configurations for Google Analytics.
            ga: {
                // GA tracking code.
                code: '',
                // GA should set cookies not to second level domain
                // but to the domain used by this site.
                domain: function () {
                    return conf.get('app.domains.www');
                }
            }
        },
        path: {
            // Absolute path of the `root_dir`.
            absPath: function () {
                return path.join(path.dirname(path.resolve(module.uri)), conf.get('path.root_dir'));
            },
            // Relative to the root directory.
            contents: 'contents',
            controllers: function () {
                return path.join(conf.get('path.root_dir'), 'controllers');
            },
            css: function () {
                return path.join(conf.get('path.absPath'), 'css');
            },
            cssCompiled: function () {
                return path.join(conf.get('path.absPath'), 'assets', 'css');
            },
            htmlCompiled: function () {
                return path.join(conf.get('path.absPath'), 'assets', 'html');
            },
            // Relative to the root directory.
            js: 'js',
            jsCompiled: function () {
                return path.join(conf.get('path.absPath'), 'js', 'compiled');
            },
            // Relative to the root directory.
            less: 'less',
            pagelets: function () {
                return path.join(conf.get('path.root_dir'), 'pagelets');
            },
            // RequireJs is configured with `baseUrl = 'pulsr'`. Therefore, the root directory must be `../pulsr`.
            root_dir: '..',
            // Relative to the root directory.
            views: 'views'
        },
        // Below are list of services this applications want to hook with.
        service: {
            // Facebook API related configurations
            facebook: {
                app_id: 'APP_ID',
                app_secret: 'APP_SECRET',
                // It should also use the site domain.
                domain: conf.get('app.domains.www')
            }
        }
    });

    // There is a file handler for LESS/CSS files, and these are options for it.
    conf.set('file.handlerOptions.' + conf.get('file.allowedMimes.css'), {
        name: 'less',
        compress: true,
        gzip: true,
        cache: true
    });
    // There is also a file handler for JS files.
    conf.set('file.handlerOptions.' + conf.get('file.allowedMimes.js'), {
        name: 'js',
        minify: true,
        gzip: true,
        cache: true
    });
    // There is also a file handler for HTML files.
    conf.set('file.handlerOptions.' + conf.get('file.allowedMimes.html'), {
        name: 'html',
        gzip: true,
        cache: true
    });
    // There is also a file handler for icon files.
    conf.set('file.handlerOptions.' + conf.get('file.allowedMimes.icon'), {
        name: 'image',
        cache: true
    });
    // There is also a file handler for PNG files.
    conf.set('file.handlerOptions.' + conf.get('file.allowedMimes.png'), {
        name: 'image',
        cache: true
    });
    // There is also a file handler for JPEG files.
    conf.set('file.handlerOptions.' + conf.get('file.allowedMimes.jpeg'), {
        name: 'image',
        cache: true
    });
    // There is also a file handler for GIF files.
    conf.set('file.handlerOptions.' + conf.get('file.allowedMimes.gif'), {
        name: 'image',
        cache: true
    });

	return conf;
});