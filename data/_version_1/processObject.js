/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-08 12:03:34
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-24 10:18:41
 * @ Description:
 */

// input = array()
// ToDo: (not) nested -> loop as long as necessary
function processObject(input) {
    var rebuildedObjects = new Array()
    var rebuildedStream = new Array()

    if (typeof (input) == 'undefined') {
        return;
    }
    console.log('Start: processObject')

    for (i = 1; i < input.length; i++) {
        if (input[i].match(/(Filter[\s+]?\/DCTDecode(.*?)Subtype[\s+]?\/Image)|(Subtype[\s+]?\/Image(.*?)Filter[\s+]?\/DCTDecode)/gi)) { // Object with Image

            console.log('> Its an Image')
            console.log('> Remove Image')
            console.log('> Update the Chunk')
            rebuildedObjects.push(input[i].replace(/obj(.*?)<<(.*?)>>(.*?)endobj/gims, 'obj$1<<$2>>endobj'))

        } else if (input[i].match(/stream(.*?)endstream[\s+]?endobj/gims)) { // Object with a Stream

            console.log('> Its a Stream')

            if (input[i].match(/(Filter[\s+]?\/FlateDecode)/gims)) { // Stream is FlateDecoded

                console.log('> FlateDecoded')
                var theStream = input[i].replace(/obj(.*?)stream(.*?)endstream[\s+]?endobj/gims, '$2')
                var resultStream = theStream.replace(/^\s+|\s+$/g, '') // get Stream without LineBreaks etc.
                var resultInflatedStream = inflateStream(resultStream) // inflate the Stream

                if (resultInflatedStream.match(/<<\/(.*?)\/(.*?)>>/gms)) { // Nested Objects inside Stream

                    console.log('> Its Nested!')
                    rebuildedStream = rebuildNestedStream(resultInflatedStream)
                    for (i=0; i < rebuildNestedStream.length; i++) {
                        rebuildedObjects.push(rebuildedStream[i])
                    }
                    //console.log(rebuildedObjects)

                } else { // No nested Objects inside Stream

                    console.log('> Its not nested!')
                    rebuildedObjects.push(rebuildStream(input[i], resultInflatedStream)) // rebuild the Object
                    //console.log(rebuildedObjects)
                }
            } else if (input[i].match(/(Filter[\s+]?\/)(?!(FlateDecode))/gims)) { // Stream has a Filter, that is not FlateDecoded
                console.log('> Filter is Unkown')
                rebuildedObjects.push(stripObject(input[i]))
            } else if (!input[i].match(/(Filter[\s+]?\/\w*)/gims)) { // Stream has no Filter
                console.log('> No Filter')

                if (!input[i].match(/((XML[\s+]?\/Metadata)|(Metadata[\s+]?\/XML))/gims)) { // Stream is XML/Metadata
                    console.log('> Its XML / MetaData')
                    rebuildedObjects.push(stripObject(input[i]))
                } else { // Unkown Stream
                    console.log('> Something else')
                    rebuildedObjects.push(stripObject(input[i]))
                }
            }
        } else { // Object without a Stream
            console.log('> Its a simple Object')
            rebuildedObjects.push(stripObject(input[i]))
        }
    }
    console.log('End: processObject (Chunk Complete)')
    return rebuildedObjects
}