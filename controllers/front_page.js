define(['baseController', 'module'], function(BaseController, module) {
    return BaseController.override({
        title: 'My Node.js app based on Pulsr',
        moduleId: module.id,
        layout: 'front-page',
        css: ['front-page.less'],
        pagelets: [
            {name: 'ga'},
            {
                name: 'navigation',
                options: {
                    class: 'left',
                    targetId: 'top-nav'
                }
            },
            {
                name: 'navigation',
                options: {
                    class: 'inline-list right',
                    targetId: 'footer-nav'
                }
            }
        ]
    });
});