define(['module', 'path'], function(module, path) {
	var conf = {},
        isProduction = (process.env.NODE_ENV == 'production'),
        productionDomain = process.env.DOMAIN,
        devDomain = 'pulsr.local';

    conf.root_dir = '..';

    conf.absPath = path.join(path.dirname(path.resolve(module.uri)), conf.root_dir);

    conf.dir = {
        controllers: path.join(conf.root_dir, 'controllers'),
        pagelets: path.join(conf.root_dir, 'pagelets'),
        views: 'views',
        contents: 'contents',
        less: 'less',
        css: path.join(conf.absPath, 'css'),
        lessCompiled: path.join(conf.absPath, 'less', 'compiled'),
        js: 'js',
        jsCompiled: path.join(conf.absPath, 'js', 'compiled'),
        htmlCompiled: path.join(conf.absPath, 'assets', 'html')
    };

    conf.port = process.env.VMC_APP_PORT || 1337;

    conf.app = {
        engine: 'pulsr',
        domains: {
            root: 'www.' + (isProduction ? productionDomain : devDomain + ':' + conf.port),
            static: 'static.' + (isProduction ? productionDomain : devDomain + ':' + conf.port)
        },
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
                    // options passed directly to the internal lru cache
                    // indicating how many items to store in a fileCache
                    max: 100,
                    // refresh the cache every 10 minutes
                    maxAge: 1000 * 60 * 10
                },
                layouts: {
                    // options passed directly to the internal lru cache
                    // indicating how many items to store in a fileCache
                    max: 100,
                    // refresh the cache every 10 minutes
                    maxAge: 1000 * 60 * 10
                }
            }
        },
        // a preparation for multi-site support: not yet implemented
        sites: {
            'pulsr.local': {
                path: {
                    root: 'pulsr.local'
                }
            }
        }
    };

    conf.file = {
        // Which kind of static files can be requested by a client?
        // Used by fileHandler.js.
        allowedMimes: [
            // CSS files
            'text/css',
            // JavaScript files
            'application/javascript',
            // icons
            'image/x-icon',
            // images
            'image/gif',
            'image/png',
            'image/jpeg',
            // html files
            'text/html',
            // plain text files
            'text/plain'
        ],
        // Which directories can be looked up by users?
        // Used by fileHandler.js.
        allowedDirs: [
            'docs',
            'img',
            'js',
            'less'
        ],
        // the name of the main layout template file
        mainLayout: 'layout',
        // default layout of a page
        defaultPageLayout: 'front-page',
        extensions: {
            // extension of template files
            template: '.hb',
            markdown: '.md',
            less: '.less',
            css: '.css',
            js: '.js',
            gzip: '.gz',
            html: '.html'
        },
        // file handler options
        handlerOptions: {}
    };
    // there is a file handler for LESS files
    // which should preprocess them by compression with gzip
    conf.file.handlerOptions[conf.file.extensions.less] = {
        compress: true,
        gzip: true,
        cache: true
    };
    // we also want a file handler for JS files
    conf.file.handlerOptions[conf.file.extensions.js] = {
        minify: true,
        gzip: true,
        cache: true
    };
    // We also want a file handler for HTML files
    conf.file.handlerOptions[conf.file.extensions.html] = {
        gzip: true,
        cache: true
    };
    // this is a configuration for Google Analytics
    conf.googleAnalytics = {
        code: '',
        // GA should set cookies not to second level domain
        // but to the domain used by this site
        domain: conf.app.domains.root
    };

    conf.db = {
        host: 'localhost',
        port: 33000,
        user: 'db_user',
        password: "passw",
        name: 'db_name'
    };
    // below are list of services this applications want to hook with
    conf.service = {
        // facebook API related configurations
        facebook: {
            app_id: 'APP_ID',
            app_secret: 'APP_SECRET',
            // it should also use the site domain
            domain: conf.app.domains.root
        }
    };

	return conf;
});