/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-29 16:15:03
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-04-05 15:45:23
 * @ Description:
 */


function readChunks(file) {
  const fileSize = file.size;
  let chunkSize = 1024 * 1024 * 1; // 1 MB
  const resetChunkSize = chunkSize;
  const maxChunkSize = 1024 * 1024 * 300; // 300 MB
  let offset = 0;
  let readBlock = null;
  const results = [];
  let error;
  let objectsArray = [];
  let returnedObjects = [];

  const onLoadHandler = function (evt) {
    objectsArray = false; // Reset Vars
    if (evt.target.error == null) { // Read Success
      objectsArray = separateObjects(evt.target.result); // returnedObjects = array[0 => obj{ID: Number, DEF: Definition <<...>>, FILTER: FlateDecode, CONTENT: ...} ...]
      if (offset + chunkSize <= fileSize) { // Weitere Chunks möglich
        if (objectsArray.length != 0) { // Objects Found
          offset += calObjectsLength(objectsArray); // Set new Position for FileReader() depending objects found in last chunk
          returnedObjects = processObject(objectsArray); // filter the array
          analyzedChunk = prepareResults(returnedObjects); // Analyze the returnedObjects
          if (analyzedChunk.length !== 0) {
            results.push(analyzedChunk); // Save Results of Chunk in Results
          }
          chunkSize = resetChunkSize; // Reduze ChunkSize to Normal
        } else if (objectsArray.length == 0) { // No Objects Found
          if (chunkSize > maxChunkSize) { // Limit the Biggest Chunk to max Chunk Size
            consoleLog('error', 'onLoadHandler', 'chunkSize > maxChunkSize');
            return error; // Return Error to Dropzone
          } if (chunkSize <= maxChunkSize) { // Proceed
            chunkSize += resetChunkSize; // Increase ChunkSize to capture larger objects or just one object
            consoleLog('log', 'onLoadHandler', 'increase ChunkSize');
          }
        }
      } else if (offset + chunkSize > fileSize) { // Letzter Chunk
        if (objectsArray.length != 0) {
          returnedObjects = processObject(objectsArray); // filter the array
          analyzedChunk = prepareResults(returnedObjects); // Analyze the returnedObjects
          if (analyzedChunk.length !== 0) {
            results.push(analyzedChunk); // Save Results of Chunk in Results
          }
          return results; // Return results to Dropzone
        } if (objectsArray.length == 0) {
          return results; // Return results to Dropzone
        }
      } else {
        consoleLog('error', 'onLoadHandler', 'offset + chunkSize');
      }
    } else if (evt.target.error != null) { // Read Error
      consoleLog('error', 'onLoadHandler', 'evt.target.error');
    }
    readBlock(offset, chunkSize, file);
  };

  readBlock = function (_offset, length, _file) {
    const r = new FileReader();
    const blob = _file.slice(_offset, length + _offset);
    r.onload = onLoadHandler;
    r.readAsBinaryString(blob);
  };

  const analyze = readBlock(offset, chunkSize, file);
}
