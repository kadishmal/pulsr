define(['http', 'url_manager'], function (http, url_manager) {
    return {
        server: http.createServer(url_manager)
    };
});