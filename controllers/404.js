define(['underscore', 'base', 'module'], function(_, BaseController, module) {
    var controller = new BaseController();

	return _.extend(controller, {
		title: 'Page not found',
        moduleId: module.id,
        layout: 'front-page',
        pagelets: [
            {
                name: 'content',
                options: {
                    layout: 'post',
                    contents: ['404']
                }
            },
            {name: 'ga'}
        ]
	});
});