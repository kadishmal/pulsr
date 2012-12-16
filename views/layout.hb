<!DOCTYPE html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<!-- Set the viewport width to device width for mobile -->
    <meta name="viewport" content="width=device-width" />
    <title>{{title}}</title>
	<meta name="description" content="">
    <link rel="stylesheet" href="//{{staticDomain}}/less/style.less">
    <link rel="stylesheet" href="//{{staticDomain}}/less/mqueries.less">
    {{{cssStyles}}}
	<script>
		var require = {
            paths: {
                requirejs: '//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.1/require.min',
                jQuery: '//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min',
                underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min',
                Backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min',
                Handlebars_full: '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.rc.1/handlebars.min',
                handlebars: 'libs/handlebars.runtime',
                reveal: 'libs/foundation/jquery.foundation.reveal',
                topbar: 'libs/foundation/jquery.foundation.topbar',
                buttons: 'libs/foundation/jquery.foundation.buttons',
                tooltip: 'libs/bootstrap/bootstrap-tooltip',
                popover: 'libs/bootstrap/bootstrap-popover'
            },
            shim: {
                requirejs: {
                    exports: 'requirejs'
                },
                Backbone: {
                    deps: ['underscore', 'jQuery'],
                    exports: 'Backbone'
                },
                handlebars: {
                    exports: 'Handlebars'
                },
                underscore: {
                    exports: "_"
                },
                jQuery: {
                  exports: "jQuery"
                },
                reveal: {
                    deps: ['jQuery']
                },
                topbar: {
                    deps: ['jQuery']
                },
                buttons: {
                    deps: ['jQuery']
                },
                tooltip: {
                    deps: ['jQuery']
                },
                popover: {
                    deps: ['jQuery', 'tooltip']
                }
            }
        };

        document.getElementsByTagName('html')[0].setAttribute('class', 'js');
	</script>
	<script data-main="//{{staticDomain}}/js/mainClient" src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.1/require.min.js"></script>
	<!-- IE Fix for HTML5 Tags -->
    <!--[if lt IE 9]>
        <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>
<body>
{{{body}}}