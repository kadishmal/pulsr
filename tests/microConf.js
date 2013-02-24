var should = require("should"),
    requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'pulsr',
    nodeRequire: require,
    paths: {
        conf: '../conf/conf'
    }
});

describe('Pulsr', function (){
    describe('microConf', function (){
        it('should return default values set in baseConf.', function (done){
            requirejs(['conf'], function (conf) {
                conf.get('app.cache.maxage').should.equal(0);
                conf.get('app.cache.fileCache.stats.max').should.equal(100);
                conf.get('app.cache.fileCache.stats.maxAgeDev').should.equal(1/60);
                conf.get('app.cache.fileCache.stats.maxAgeProduction').should.equal(10);
                conf.get('app.cache.fileCache.stats.maxAge').should.equal(1000);
                conf.get('app.cache.fileCache.layouts.max').should.equal(100);
                conf.get('app.cache.fileCache.layouts.maxAgeDev').should.equal(1/60);
                conf.get('app.cache.fileCache.layouts.maxAgeProduction').should.equal(10);
                conf.get('app.cache.fileCache.layouts.maxAge').should.equal(1000);
                conf.get('app.cache.fileCache.templates.max').should.equal(100);
                conf.get('app.cache.fileCache.templates.maxAgeDev').should.equal(1/60);
                conf.get('app.cache.fileCache.templates.maxAgeProduction').should.equal(10);
                conf.get('app.cache.fileCache.templates.maxAge').should.equal(1000);
                conf.get('app.engine').should.equal('pulsr');

                conf.get('app.domains.production').should.equal('pulsr.org');
                conf.get('app.domains.dev').should.equal('pulsr.local');
                conf.get('app.domains.root').should.equal('pulsr.local:1337');
                conf.get('app.domains.static').should.equal('static.pulsr.local:1337');
                conf.get('app.domains.www').should.equal('www.pulsr.local:1337');
                conf.get('app.port').should.equal(1337);

                conf.get('db.host').should.equal('localhost');
                conf.get('db.port').should.equal(33000);
                conf.get('db.user').should.equal('db_user');
                conf.get('db.password').should.equal('passw');
                conf.get('db.name').should.equal('db_name');

                conf.get('file.allowedDirs')['/docs'].allowedMimes.should.be.an.instanceOf(Array);
                conf.get('file.allowedDirs')['/img'].allowedMimes.should.be.an.instanceOf(Array);
                conf.get('file.allowedDirs')['/js'].allowedMimes.should.be.an.instanceOf(Array);
                conf.get('file.allowedDirs')['/less'].allowedMimes.should.be.an.instanceOf(Array);
                conf.get('file.allowedDirs')['/'].allowedMimes.should.be.an.instanceOf(Array);
                conf.get('file.allowedDirs')['/docs'].allowedMimes.should.have.lengthOf(2);
                conf.get('file.allowedDirs')['/img'].allowedMimes.should.have.lengthOf(3);
                conf.get('file.allowedDirs')['/js'].allowedMimes.should.have.lengthOf(1);
                conf.get('file.allowedDirs')['/less'].allowedMimes.should.have.lengthOf(1);
                conf.get('file.allowedDirs')['/'].allowedMimes.should.have.lengthOf(3);
                conf.get('file.allowedDirs')['/docs'].allowedMimes.should.include('text/html');
                conf.get('file.allowedDirs')['/docs'].allowedMimes.should.include('text/css');
                conf.get('file.allowedDirs')['/img'].allowedMimes.should.include('image/gif');
                conf.get('file.allowedDirs')['/img'].allowedMimes.should.include('image/png');
                conf.get('file.allowedDirs')['/img'].allowedMimes.should.include('image/jpeg');
                conf.get('file.allowedDirs')['/js'].allowedMimes.should.include('application/javascript');
                conf.get('file.allowedDirs')['/less'].allowedMimes.should.include('text/css');
                conf.get('file.allowedDirs')['/'].allowedMimes.should.include('image/x-icon');
                conf.get('file.allowedDirs')['/'].allowedMimes.should.include('image/png');
                conf.get('file.allowedDirs')['/'].allowedMimes.should.include('text/plain');

                conf.get('file.allowedMimes').css.should.equal('text/css');
                conf.get('file.allowedMimes').js.should.equal('application/javascript');
                conf.get('file.allowedMimes').icon.should.equal('image/x-icon');
                conf.get('file.allowedMimes').gif.should.equal('image/gif');
                conf.get('file.allowedMimes').png.should.equal('image/png');
                conf.get('file.allowedMimes').jpeg.should.equal('image/jpeg');
                conf.get('file.allowedMimes').html.should.equal('text/html');
                conf.get('file.allowedMimes').plain.should.equal('text/plain');

                done();
            });
        });
    });
});