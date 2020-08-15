/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-08 11:14:54
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-24 10:17:29
 * @ Description:
 */

function readChunks(file) {
    var fileSize = file.size
    var chunkSize = 1024 * 1024 * 1 // 1 MB
    var maxChunkSize = 1024 * 1024 * 300 // 300 MB
    var resetChunkSize = chunkSize
    var offset = 0
    var readBlock = null
    var results = []
    var error
    var singleObjects = new Array()
    var returnedObjects = new Array()

    var onLoadHandler = function (evt) {
        singleObjects = false // Reset Vars
        if (evt.target.error == null) {
            console.log('Offset: ' + offset / 1024 / 1024) // Debug
            singleObjects = separateObjects(evt.target.result) // returnedObjects = array[0...n][obj_0...obj_n]

            // Check Position in FileReader
            if (offset + chunkSize <= fileSize) { // Weitere Chunks möglich
                if (singleObjects.length != 0) {
                    offset += calArrayStringLength(singleObjects) // Set new Position for FileReader() [length counts chars not bytes!]
                    returnedObjects = processObject(singleObjects) // filter the array
                    analyzedChunk = prepareResults(returnedObjects) // Analyze the returnedObjects
                    if (analyzedChunk.length !== 0) {
                        results.push(analyzedChunk) // Save Results of Chunk in Results
                    }
                    chunkSize = resetChunkSize // Reduze ChunkSize to Normal
                    console.log('Results Array updated')
                } else if (singleObjects.length == 0) {
                    if (chunkSize > maxChunkSize) { // Limit the Biggest Chunk to max Chunk Size
                        error = 'Error: maxChunkSize reached and nothing found to return'
                        console.log(error)
                        return error // Return Error to Dropzone
                    } else if (chunkSize <= maxChunkSize) { // Proceed
                        chunkSize += resetChunkSize // Increase ChunkSize to capture larger objects or just one object
                        console.log('!returnedObjects -> Increase Chunk Size to: ' + chunkSize)
                    }
                }
            } else if (offset + chunkSize > fileSize) { // Letzter Chunk
                if (singleObjects.length != 0) {
                    returnedObjects = processObject(singleObjects) // filter the array
                    analyzedChunk = prepareResults(returnedObjects) // Analyze the returnedObjects
                    if (analyzedChunk.length !== 0) {
                        results.push(analyzedChunk) // Save Results of Chunk in Results
                    }
                    console.log('returnedObjects && LastChunk')
                    console.log(results)
                    return results // Return results to Dropzone
                } else if (singleObjects.length == 0) {
                    console.log('!returnedObjects && LastChunk')
                    console.log(results)
                    return results // Return results to Dropzone
                }
            } else {
                error = 'Error: offset + chunkSize !'
            }
        } else if (evt.target.error != null) {
            error = 'Error: evt.target.error'
            console.log(error)
            return // Return Error to Dropzone
        }
        console.log('##### End Chunk')
        readBlock(offset, chunkSize, file)
    }

    readBlock = function (_offset, length, _file) {
        var r = new FileReader()
        var blob = _file.slice(_offset, length + _offset)
        r.onload = onLoadHandler
        r.readAsBinaryString(blob)
    }

    var analyze = readBlock(offset, chunkSize, file)
}

var input = document.getElementById("inputFile")
input.addEventListener("change", function () {
    readChunks(this.files[0])
})