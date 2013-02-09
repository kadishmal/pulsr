<div id="menus-container" class="hide chunked">
	<ul class="{{class}}">
	{{#list menus}}{{#link text href}}{{/link}}{{/list}}
	</ul>
</div>
<script>
    var d = document, container = d.getElementById('menus-container');
    d.getElementById('{{targetId}}').innerHTML = container.innerHTML;
    container.parentNode.removeChild(container);
</script>