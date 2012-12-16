<script>
requirejs(['jQuery', 'marked'], function($, marked) {
    $('#content').html(marked({{{content}}}));
});
</script>