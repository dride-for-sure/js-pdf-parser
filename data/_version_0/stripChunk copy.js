/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-08 12:03:34
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-21 16:35:16
 * @ Description:
 */

function stripChunk(inputChunk) {
    var strippedChunk = inputChunk; // Put inputChunk in strippedChunk
    var regexObjects = new RegExp('\\d{1,4}[\\s+]?\\d{1}[\\s+]?obj[\\s+]?(.*?)endobj', 'gims'); // Regex all Objects with or without Streams
    var resultObject; // Initiate Result: (ref offset obj<<...>> (...)? endobj)
    var k = 0;
    while ((resultObject = regexObjects.exec(inputChunk))) { // As long as complete Objects with or without Streams in inputChunk
        console.log('Object Found');
        //console.log(resultObject[0]);
        // Check if (Image) OR (Object with Stream) OR (Object without Stream)
        
        if (resultObject[0].match(/(Filter\/DCTDecode(.*?)Subtype\/Image)|(Subtype\/Image(.*?)Filter\/DCTDecode)/gi)) {
            console.log('Its an Image');
            console.log('# Remove Image');
            console.log('## Update the Chunk');
            var strippedChunk = replaceAll(strippedChunk, resultObject[0], ''); // Remove Image
        } else if (resultObject[0].match(/stream(.*?)endstream[\s+]?endobj/gims)) { // Object with a Stream
            console.log('Its a Stream');

            if (resultObject[1].match(/(Filter\/FlateDecode)/gims)) { // Stream is FlateDecoded
                console.log('# FlateDecoded');
                var theStream = resultObject[1].replace(/<<(.*?)>>stream(.*?)endstream/gims, '$2');
                var resultStream = theStream.replace(/^\s+|\s+$/g, ''); // get Stream without LineBreaks etc.
                var resultInflatedStream = inflateStream(resultStream); // inflate the Stream

                if (resultInflatedStream.match(/<<\/(.*?)\/(.*?)>>/gms)) { // Nested Objects inside Stream
                    console.log('## Its Nested!');
                    var rebuildedObject = rebuildNestedStream(resultInflatedStream); // rebuild the Objects
                    //console.log('Thats it:')
                    //console.log(rebuildedObject);
                } else { // No nested Objects inside Stream
                    console.log('## Its not nested!');
                    var rebuildedObject = rebuildStream(resultObject[0], resultInflatedStream); // rebuild the Object
                    //console.log('Thats it:')
                    //console.log(rebuildedObject);
                }
            } else if (resultObject[1].match(/(Filter\/)(?!(FlateDecode))/gims)) { // Stream has a Filter, that is not FlateDecoded
                console.log('# Filter is Unkown');
                var rebuildedObject = resultObject[0] + '\n'; // Add LineBreak
            } else if (!resultObject[1].match(/(Filter\/\w*)/gims)) { // Stream has no Filter
                console.log('# No Filter');

                if (!resultObject[1].match(/((XML\/Metadata)|(Metadata\/XML))/gims)) { // Stream is XML/Metadata
                    console.log('## Its XML / MetaData');
                    var rebuildedObject = resultObject[0] + '\n'; // Add LineBreak
                } else { // Unkown Stream
                    console.log('## Something else');
                    var rebuildedObject = resultObject[0] + '\n'; // Add LineBreak
                }
            }
        } else { // Object without a Stream
            console.log('Its a simple Object without a Stream');
            console.log('# Leave as it is + add Line Break');
            var rebuildedObject = resultObject[0].replace(/ /gims, ' \n');
        }
        console.log('#### Update strippedChunk')
        //console.log(rebuildedObject);
        var strippedChunk = replaceAll(strippedChunk, resultObject[0], rebuildedObject); // Refresh output chunk
        k++; // Set Counter ++;

    }
    // There is non complete Object at the End of the inputChunk
    if (k == 0) { // Nothing found in the given Chunk
        console.log('################### Nothing Found');
        return false;
    } else {
        console.log('################### Chunk Complete!');
        return strippedChunk;
    }
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}