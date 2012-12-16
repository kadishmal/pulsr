// post.js
// This layout displays single post contents on a page.
// Intended for the use to display specific articles.
define(['fs', 'path', 'conf', 'marked'], function(fs, path, conf, marked) {
    return {
        render: function (contents, display) {
            var output = '';

            if (contents.length) {
                var contentPath = path.join(conf.dir.contents, contents[0] + conf.file.extensions.markdown);

                // Since this is a single post, we can directly check if it exists
                fs.exists(contentPath, function (exists) {
                    if (!exists) {
                        // inform the controller to send 404 Status Code to a client.
                        display(false);
                        contentPath = path.join(conf.dir.contents, '404' + conf.file.extensions.markdown);
                    }

                    // prepare the page (grid) for the post.
                    output =
                        '<script>' +
                            'document.getElementById("pageView").innerHTML = \'' +
                            '<div class="twelve columns" id="content-' + contents[0] + '"></div>' +
                            '\';' +
                        '</script>';

                    display(output, true);

                    fs.readFile(contentPath, 'utf8', function (err, data) {
                        if (err) {
                            console.log('Could not read ' + contentPath + ' content.');
                        }
                        else{
                            var containerID = 'content-' + contents[0],
                                contentID = containerID + '-body';

                            // now need to trim the content to display only the excerpt of it.
                            var match = data.match(/<a[^>]+class="[^"]*more[^"]*"[^>]*>[^<]+<\/a>/);

                            if (match) {
                                var ix = data.indexOf(match[0]);

                                // remove the "Read more" button
                                data = data.substring(0, ix) + data.substring(ix + match[0].length);
                            }

                            data = '<div class="hide chunked" id="'+ contentID +'">' + marked(data) + '</div>' +
                                '<script>' +
                                'var contentBody = document.getElementById("'+ contentID +'");' +
                                'document.getElementById("' + containerID + '").innerHTML = ' +
                                'contentBody.innerHTML;' +
                                'contentBody.parentNode.removeChild(contentBody);' +
                                '</script>';

                            display(data);
                        }
                    });
                });
            }
            else{
                display();
            }
        }
    };
});