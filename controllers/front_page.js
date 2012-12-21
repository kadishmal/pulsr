define(['baseController', 'module'], function(BaseController, module) {
    return BaseController.override({
        title: 'My Node.js app based on Pulsr',
        moduleId: module.id,
        layout: 'front-page',
        css: ['front-page.less'],
        pagelets: [
            {name: 'ga'}
        ]
    });
});