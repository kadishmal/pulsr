define(['baseController', 'module'], function(BaseController, module) {
    return BaseController.override({
        title: 'Pulsr Node.js Web Framework for teams',
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