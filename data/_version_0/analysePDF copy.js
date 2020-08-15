/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-08 11:18:21
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-20 20:25:29
 * @ Description:
 */


function analysePDF(raw) {
    // Asynchronous download PDF
    var loadingTask = pdfjsLib.getDocument({
        data: raw,
    });
    console.log('##### Analyse PDF');
    loadingTask.promise.then(function(doc) {
            var numPages = doc.numPages;
            console.log("# Document Loaded");
            console.log("Number of Pages: " + numPages);
            console.log();

            var lastPromise; // will be used to chain promises
            lastPromise = doc.getMetadata().then(function(data) {
                console.log("# Metadata Is Loaded");
                console.log("## Info");
                console.log(JSON.stringify(data.info, null, 2));
                console.log();
                if (data.metadata) {
                    console.log("## Metadata");
                    console.log(JSON.stringify(data.metadata.getAll(), null, 2));
                    console.log();
                }
            });

            var loadPage = function(pageNum) {
                return doc.getPage(pageNum).then(function(page) {
                    console.log("# Page TrimBox " + pageNum);
                    var viewport = page.getViewport({
                        scale: 1.0
                    });
                    console.log(viewport.width / 72 * 2.54 + " x " + viewport.height / 72 * 2.54);
                    console.log();
                });
            };
            // Loading of the first page will wait on metadata and subsequent loadings
            // will wait on the previous pages.
            for (var i = 1; i <= numPages; i++) {
                lastPromise = lastPromise.then(loadPage.bind(null, i));
            }
            return lastPromise;
        })
        .then(
            function() {
                console.log("# End of Document");
            },
            function(err) {
                console.error("Error: " + err);
            }
        );
    var status = 'success';
    return status;

};