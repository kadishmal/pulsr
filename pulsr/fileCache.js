/*
 * fileStats.js
 * A module to which uses async-cache to provide file stats information.
 * fs.stat() is requested only once in a while. The result is then stored
 * in the cache which is served to other modules upon request.
 * async-cache allows to significantly decrease I/O hits.
 */
define(['async-cache', 'fs', 'conf'], function(AsyncCache, fs, conf) {
    var stats = new AsyncCache({
        // options passed directly to the internal lru cache
        // indicating how many items to store in a fileCache
        max: conf.app.cache.fileCache.stats.max,
        // refresh the cache every maxAge time
        maxAge: conf.app.cache.fileCache.stats.maxAge,
        // method to load a thing if it's not in the cache.
        // key must be unique in the context of this cache.
        load: function (filePath, cb) {
            // the key can be something like the path, or fd+path, or whatever.
            // something that will be unique.
            // this method will only be called if it's not already in cache, and will
            // cache the result in the lru.
            fs.stat(filePath, cb)
        }
    })

    return {
        stats: stats
    };
});