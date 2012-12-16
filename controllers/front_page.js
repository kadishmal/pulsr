define(['underscore', 'base', 'module'], function(_, BaseController, module) {
    var controller = new BaseController();

    return _.extend(controller, {
        title: 'My Node.js app based on Pulsr',
        moduleId: module.id,
        layout: 'front-page',
        css: ['front-page.less'],
        pagelets: [
            {name: 'ga'}
        ]
    });
});