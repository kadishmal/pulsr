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
	<script data-main="mainClient.js" src="//{{staticDomain}}/js/libs/require.js"></script>
	<!-- IE Fix for HTML5 Tags -->
    <!--[if lt IE 9]>
        <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>
<body>
{{{body}}}