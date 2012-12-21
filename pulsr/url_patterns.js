define(function() {
	return {
		// sorted by priority: the first one matched will process the request
		'/': 'front_page',
        // /api/actionName
        '/api(/([\\w-]+(/(.+)*)*)*)*': 'api',
        // blog and all kinds of content requests can be handled by the same
        // "blog" controller
        '/blog(/([\\w-]+)*)*': 'post',
		// The below will match everything else: used as the last option.
		// DO NOT remove it or the response will never be returned.
		'/.*': 'fileHandler'
	};
});