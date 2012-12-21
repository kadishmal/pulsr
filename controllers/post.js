define(['baseController', 'module'], function(BaseController, module) {
    return BaseController.override({
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