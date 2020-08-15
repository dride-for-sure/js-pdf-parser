/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-28 11:15:03
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-04-06 11:55:46
 * @ Description: Rebuild, Inflate and Clean the Objects Array
 */

function readFile(file) {
  // Read the File in Chunks
  // get one object
}
/**
 * Separate Objects from String \\d{1,4}[\\s+]?\\d{1}[\\s+]?obj[\\s+]?(.*?)endobj
 *
 * @param {string} string
 * @returns {array} [{id,val}...{id,val}]
 */
function separateObj(string) {
  const array = new Array();
  let offset = 0;
  const match = string.match(/endobj\s+/gims) || [].length;
  if (match == 0) {
    increaseChunkSize(); // increase Chunk Size
  } else {
    for (let i = 1; i <= match; i++) {
      const start = getPosition(string, '\\d{1,4}\\s+\\d{1}\s+obj', j, 0);
      if (start == -1) { nextChunk(); }
      const end = getPosition(string, 'endobj\\s+', i, 1);
      const slice = string.slice(start, end);
      const jj = (slice.match(/\d{1,4}\s+\d{1}\s+obj/gims) || []).length;
      if (i == jj) { // slice: obj ... endobj
        const objKey = slice.substr(0, slice.match(/obj/gims) + 3);
        const objVal = slice.substr(objKey.length);
        const obj = {
          id: objKey,
          val: objVal,
        };
        array.push(obj);
        j += jj;
        offset += end;
      } else if (i < jj) { // slice: obj ... obj ... endobj
        continue; // increase slice up to i++ endobj tags
      } else if (i > jj) { // slice: ... endobj
        j++;
      }
    }
    return analyzeObj(array);
  }
}

/**
 * Analyze Objects for DCTDecode, Stream with FlateDecoded, Unkown Filter, No Filter {XML, Else}
 *
 * @param {obj} obj
 * @returns
 */
function analyzeObj(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].val.match(/(Filter[\s+]?\/DCTDecode(.*?)Subtype[\s+]?\/Image)|(Subtype[\s+]?\/Image(.*?)Filter[\s+]?\/DCTDecode)/gims)) { // Stream Object with DCTDecode

    } else if (array[i].val.match(/obj(.*?)(Filter[\s+]?\/FlateDecode)(.*?)stream(.*?)endstream[\s+]?endobj/gims)) { // Stream Object with FlateDecode
      // Nested?
      // NotNested?
    } else if (array[i].val.match(/obj(.*?)(Filter[\s+]?\/FlateDecode)(.*?)stream(.*?)endstream[\s+]?endobj/gims)) { // Stream Object without FlateDecode and XML/Metadata

    } else { // Other Object
      continue;
    }
  }
  return array;
}

/**
 * Inflate FlateDecoded Stream
 *
 * @param {string} stream
 * @returns {string}
 */
function inflateStream(stream) {
  const blob = pako.inflate(stream);
  const output = new Uint8Array(blob).reduce((data, byte) => data + String.fromCharCode(byte), '');
  return output;
}
