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
        cssCompiled: path.join(conf.absPath, 'assets', 'css'),
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
        // Which directories can be looked up by users?
        // Used by fileHandler.js.
        allowedDirs: {},
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
        // File handler options. Each file handler should be identified by the mime type
        // of files it handles. For example, *pulsr/fileHandlers/less.js* handles
        // requests for *.less* and *.css* files which both have mime type of **text/css**.
        // So this handlerOptions hash should have a `key = "text/css"`, and a hash object
        // as its value which represent options for that particular file handler.
        handlerOptions: {}
    };
    // Define a list of directories and types of files which are allowed to be accessed
    // in those directories.
    conf.file.allowedDirs['/docs'] = {
        allowedMimes: [conf.file.allowedMimes['html'], conf.file.allowedMimes['css']]
    };
    conf.file.allowedDirs['/img'] = {
        allowedMimes: [conf.file.allowedMimes['gif'], conf.file.allowedMimes['png'], conf.file.allowedMimes['jpeg']]
    };
    conf.file.allowedDirs['/js'] = {
        allowedMimes: [conf.file.allowedMimes['js']]
    };
    conf.file.allowedDirs['/less'] = {
        allowedMimes: [conf.file.allowedMimes['css']]
    };
    // Allow access to only icon and plain text files from the root directory.
    conf.file.allowedDirs['/'] = {
        allowedMimes: [conf.file.allowedMimes['icon'], conf.file.allowedMimes['png'], conf.file.allowedMimes['plain']]
    };
    // There is a file handler for LESS/CSS files, and these are options for it.
    conf.file.handlerOptions[conf.file.allowedMimes.css] = {
        name: 'less',
        compress: true,
        gzip: true,
        cache: true
    };
    // There is also a file handler for JS files.
    conf.file.handlerOptions[conf.file.allowedMimes.js] = {
        name: 'js',
        minify: true,
        gzip: true,
        cache: true
    };
    // There is also a file handler for HTML files.
    conf.file.handlerOptions[conf.file.allowedMimes.html] = {
        name: 'html',
        gzip: true,
        cache: true
    };
    // There is also a file handler for icon files.
    conf.file.handlerOptions[conf.file.allowedMimes.icon] = {
        name: 'image',
        cache: true
    };
    // There is also a file handler for PNG files.
    conf.file.handlerOptions[conf.file.allowedMimes.png] = {
        name: 'image',
        cache: true
    };
    // There is also a file handler for JPEG files.
    conf.file.handlerOptions[conf.file.allowedMimes.jpeg] = {
        name: 'image',
        cache: true
    };
    // There is also a file handler for GIF files.
    conf.file.handlerOptions[conf.file.allowedMimes.gif] = {
        name: 'image',
        cache: true
    };
    // These are configurations for Google Analytics.
    conf.googleAnalytics = {
        // GA tracking code.
        code: '',
        // GA should set cookies not to second level domain
        // but to the domain used by this site.
        domain: conf.app.domains.root
    };
    // The database configurations can be defined like this.
    conf.db = {
        host: 'localhost',
        port: 33000,
        user: 'db_user',
        password: "passw",
        name: 'db_name'
    };
    // Below are list of services this applications want to hook with.
    conf.service = {
        // Facebook API related configurations
        facebook: {
            app_id: 'APP_ID',
            app_secret: 'APP_SECRET',
            // It should also use the site domain.
            domain: conf.app.domains.root
        }
    };

	return conf;
});