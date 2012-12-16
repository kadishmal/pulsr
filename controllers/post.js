define(['underscore', 'base', 'module'], function(_, BaseController, module) {
    var controller = new BaseController();

	return _.extend(controller, {
		title: 'Main page',
        moduleId: module.id,
        layout: 'front-page',
        pagelets: [
            {
                name: 'content',
                options: {
                    layout: 'post',
                    contents: []
                },
                // these sub-pagelets are run AFTER this pagelet has finished rendering
                // its contents
                pagelets: [
                    {
                        name: 'ga'
                    }
                ]
            }
        ]
	});
});