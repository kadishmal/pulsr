# Pulsr Web App Framework Change Log

## Version 0.2.1 February 14, 2013

- Enh: allow to custom set maxAge for layouts and stats cache.
- Enh: implement caching in microConf.
- Enh: added a Handlebars enabled templates async-cache to fileCache.
- Enh: added Handlebars extension to the baseConf.
- Enh: in Dev environment, don't cache static assets by default.
- Enh: allow to specify which data to load in the navigation pagelet.
- Enh: default targetId for pagelets can be the name of the pagelet itself.
- Enh: use the new template async-cache from fileCache in ga pagelet.
- Fix: After commit b74da1af0d01b3260e222b09c476e64ff199bdf1 JavaScript files are loaded by RequireJS from main www domain. Should load from the same static domain.
- Fix: a copy paste bug introduced in 62bb24db087970a9995a55cf1a797243db243dc1.
- Fix: a bug from 7cb0cd1576190a8b4b1b4be73f487a224c84616c which passed a wrong cache key (`key` instead of `chainKey`).
- Fix: setting 0 for fileCache maxAge doesn't work properly. async-cache module's bug or behavior.
- Fix: when port is 80, no need to add it to the URL.
- Test: added microConf tests.
- Doc: updated docs.
- Make: add more directories to generate Pulsr docs from.
- package.json: updated "should" module.

## Version 0.2.0 February 12, 2013

- New: added a microConf module which will allow users to override default system configurations.
- Ref: updated Pulsr to use the new microConf to manage framework-wide configurations. All tests pass.

## Version 0.1.9 February 9, 2013

- New: added a "navigation" pagelet to display site navigation menus.
- Enh: don't assign pagelet options to real pagelets. Instead pass them as function argument.
- Enh: added navigation menu to be displayed on the front page.
- Enh: load RequireJs from the same static domain instead of cdnjs.cloudflare.com. No need to resolve one more DNS. Can combine RequireJS configurations inside the same file.
- Enh: redirect root domain requests to www subdomain.
- Test: added more tests to htmlFileHandler.
- Test: added a navigation pagelet test.
- Test: added more tests to htmlFileHandler to check 304 HTTP response.

## Version 0.1.8 January 22, 2013

- Fix: a bug from moment() module which modified the cached fs.stat() object.
- Enh: Gzip HTML files using Streams directly.
- Test: added htmlFileHandler tests.
- Test: refactored fileHandler test.

## Version 0.1.7 January 5, 2013

- New: created imageFileHandler to handle image file requests.
- Test: moved image related tests from fileHandler to imageFileHandler.

## Version 0.1.6 January 5, 2013

- Fix: CSS/LESS files should be served from requested directories not from /less only.
- Fix: favicon icons as well as plain text files from the root directory should be accessible.
- Test: added test cases to fileHandler to request favicon icons.
- Test: add a test lessFileHandler to request CSS files from a different directory.
- Doc: updated docs.
- Com: updated comments.
- Make: added a script to build docs.

## Version 0.1.5 January 2, 2013

- Enh: define allowed mime types as an object instead of an array.
- Enh: Array.indexOf seems to be faster than its RegExp equivalent.
- Enh: allowedDirsRE RegEx should test for full words not substrings.
- Enh: now multiple mime types can be handled by one file handler. Formerly a file handler could handle only a specific file extension.
- Ref: refactored the code.

## Version 0.1.4 December 31, 2012

- New: Gzip and Cache-enable static HTML files.
- Ref: updated comments in *pulsr/gzip.js*.
- Doc: updated docs.
- Com: updated the comment.
- Git: don't track the "assets" directory.

## Version 0.1.3 December 29, 2012

- New: split mqueries.less into two files: MQ min-width:768px and max-width: 767px.
- Enh: when requesting mqueries on iPad serve only min-width:768px MQ. No need to serve mobile-only MQ on iPad.
- Ref: removed headers.js module. No need.
- Test: fixed jsFileHandler test.
- Test: added a new test to fileHandler.

## Version 0.1.2 December 23, 2012

- New: allow access to static files located only in permitted directories.
- Enh: upgraded uglify-js to v2.2.2 from uglify-js2 v2.1.6, requirejs to v2.1.2 from 2.1.1.
- Enh: allow `image/jpeg` mime type.
- Enh: refactored package.json: listed module dependencies in alphabetical order.
- Enh: don't allow directories to be requested. Return 403 Forbidden error.
- Enh: make sure user doesn't try to access restricted areas using "../" relative path.
- Enh: refer to /less directory instead of /css for consistency.
- Test: additional test for RestController.
- Test: added a new fileHandler test.

## Version 0.1.1 December 23, 2012

- New: added a **restController** which users can override to provide their own RESTful APIs.
- New: users can indicate a **default** action for a RestController.
- Enh: renamed a **base** controller to a **baseController**
- Enh: added an `override` function which provides an easy way to override **baseController**.
- Enh: updated a sample **api.js** controller which handles RESTful requests.
- Test: added a test case for RestController.
- Docs: updated docs.

## Version 0.1.0 December 18, 2012

- Enh: retrieve layouts using fileCache as well.
- Test: added a test suit for a base controller.

## Version 0.0.9 December 18, 2012

- New: a fileCache module which caches files stat information. Uses async-cache module.
- New: use fileCache module to get file stat information.
- New: allow users to configure fileCache settings.
- Enh: code refactoring.
- Enh: use app port when in dev environment.
- Test: add "www" subdomain instead of a root domain to Travis script.

## Version 0.0.8 December 18, 2012

- New: use Streams to stream static files instead of reading into memory.
- Test: setup Travis script.
- Test: added jsFileHandler and lessFileHandler tests.
- Doc: added MIT license file.
- Doc: updated README.

## Version 0.0.7 December 15, 2012

- New: initial release.