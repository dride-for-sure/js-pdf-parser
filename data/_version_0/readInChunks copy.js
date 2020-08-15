/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-08 11:14:54
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-20 20:13:07
 * @ Description:
 */

function readInChunks(file) {
    var fileSize = file.size;
    var chunkSize = 1024 * 1024 * 5; // 5 MB
    var maxChunkSize = 1024 * 1024 * 300; // 300 MB
    var i = 1;
    var resetChunkSize = chunkSize;
    var offset = 0;
    var readBlock = null;
    var resultPDF = '';

    var onLoadHandler = function (evt) {
        
        /*

        evt.target.error == null

            var returnArray = stripStream(evt.target.result);
            var returnedChunk = returnArray[0];

            offset + chunkSize <= fileSize // Weitere Chunks möglich
                returnedChunk
                    i = 1;
                    offset += evt.target.result.length;
                    resultPDF += returnedChunk;
                    chunkSize = resetChunkSize; // Reduze ChunkSize to Normal
                !returnedChunk
                    (maxChunkSize / chunkSize) > i
                        offset += chunkSize;
                        resultPDF += evt.target.result;
                    (maxChunkSize / chunkSize) <= i
                        chunkSize += resetChunkSize; // Increase ChunkSize to capture larger objects or just one object
                        i++;
            offset + chunkSize > fileSize;  // Letzter Chunk
                returnedChunk
                    resultPDF += returnedChunk;
                    analysePDF(resultPDF);
                    return;
                !returnedChunk
                    analysePDF(resultPDF);
                    return;
        evt.target.error != null
            console.log('Error: evt.target.error')
            return;

        */
        
        if (evt.target.error == null) {
            
            if (i>50) {
                return;
            }
            // Display the Chunk Number
            console.log("Chunk: "+i);
            i++;
            
            
            var returnArray = stripStream(evt.target.result);
            var lastIndex = returnArray[1];
            var returnedChunk = returnArray[0];
            console.log("Returned Chunk: " +returnedChunk);
            console.log("Offset: " + offset);
            hChunkSize = chunkSize / 1024 / 1024;
            hFileSize = fileSize / 1024 / 1024;
            console.log("ChunkSize: "+ hChunkSize+" MB ("+chunkSize+")");
            console.log("FileSize: "+ hFileSize+" MB ("+fileSize+")");
            
            if (returnedChunk) {
                console.log('##### This is the Cleaned Chunk #####');
                console.log(returnedChunk);
                offset += evt.target.result.length; // Set new Offset for new Position in Next Round
                resultPDF += returnedChunk; // Build the complete result PDF
                chunkSize = resetChunkSize;
            } else /*(!returnedChunk && (chunkSize + offset < fileSize))*/ {
                chunkSize += resetChunkSize;
                console.log('##### FileReader: CHUNKSIZE INCREASED: '+ chunkSize +' #####');
            }

        } else {
            console.log('##### FileReader: ERROR #####');
            return;
        }

        if (offset >= fileSize) {
            console.log('##### FileReader: FILE END #####');
            analysePDF(resultPDF);
            return;
        } else if (chunkSize + offset >= fileSize) {
            console.log('##### FileReader: End of File and no relevant objects found #####');
            resultPDF += evt.target.result;
            analysePDF(resultPDF);
            return;
        }

        console.log('#################### Next Chunk ####################');
        readBlock(offset, chunkSize, file);
    }

    readBlock = function (_offset, length, _file) {
        var r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = onLoadHandler;
        r.readAsBinaryString(blob);
    }

    readBlock(offset, chunkSize, file);
}

var input = document.getElementById("inputFile");
input.addEventListener("change", function () {
    readInChunks(this.files[0]);
});
