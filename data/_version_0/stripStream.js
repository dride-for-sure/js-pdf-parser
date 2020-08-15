/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-08 12:03:34
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-22 15:55:45
 * @ Description:
 */


function stripStream(inputChunk) {
    var cleanChunk = inputChunk; // Put inputChunk in cleanChunk
    var regexObjects = new RegExp('\\d{1,4}[\\s+]?\\d{1}[\\s+]?obj[\\s+]?(.*?)endobj', 'gims'); // Regex all Objects with or without Streams
    var resultObject; // Initiate Result: (ref offset obj<<...>> (...)? endobj)
    var lastIndex;
    var k = 0;
    while ((resultObject = regexObjects.exec(inputChunk))) { // As long as complete Objects with or without Streams in inputChunk

        console.log('##### Object Found');

        // Check if Image
        if (resultObject[0].match(/(Filter\/DCTDecode(.*?)Subtype\/Image)|(Subtype\/Image(.*?)Filter\/DCTDecode)/gi)) {

            console.log('Its an Image');
            //console.log(resultObject[0]);
            //var rebuildedObject = rebuildImageObject(resultObject[0]);

            console.log('Remove it ...')
            //console.log(rebuildedObject);
    
            var cleanChunk = replaceAll(cleanChunk, resultObject[0], ''); // Refresh output chunk
        }
        k++; // Set Counter ++;
        lastIndex = regexObjects.lastIndex;
    }

    if (k == 0) {

        console.log('##### Nothing Found');
        return false;

    } else {

        console.log('##### Chunk Complete!');
        return cleanChunk;

    }
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}