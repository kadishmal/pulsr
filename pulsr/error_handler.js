define(function() {
	return {
		handle: function(request, response, err) {
            console.log(err);
            // errno 34 means that file hasn't been found
            // which in HTTP terms means 404 status code.
            response.statusCode = (err.errno == 34 ? 404 : err.errno);
			response.end()
            // TODO: it may be a good idea to log certain types of errors.
            // TODO: being able to configure where to store the logs would
            // be a great option.
		}
	}
});