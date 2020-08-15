/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-09 20:55:28
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-24 10:18:28
 * @ Description:
 */

// NESTED
// rebuildNestedStream (inflatedStream)
// Obj1 Gen(0) obj <<...>> content endobj ... ObjN Gen(0) obj <<...>> content endobj
function rebuildNestedStream(inflatedStream) {
    var rebuildedStream = new Array();
    var objects = new Array();

    var referenzString = inflatedStream.replace(/<<\/(.*)/g, '');
    var referenz = referenzString.match(/[\s+]?(\d{1,3})[\s+]/g); // Regex Referenztable in array('Obj1'...'ObjN) <--- TODO!!!
    var objectsString = inflatedStream.replace(/(.*?)(<<.*)/g, "$2");
    var i = 1;
    while (getPosition(objectsString, '>>', i) && i < 50) { // As long there is a position for i>>
        if (objectsString.substr(getPosition(objectsString, '>>', i) + 2, 2) == '<<') { // if i>> followed by <<
            var tmpSlice = objectsString.slice(0, getPosition(objectsString, '>>', i) + 2); // Slice String after position of i>> -> $tmpSlice
        } else { // if i>> followd not by <<
            var tmpSlice = objectsString.slice(0, getPosition(objectsString.substr(getPosition(objectsString, '>>', i) + 2), '<<', 1) + getPosition(objectsString, '>>', i) + 2);
        }
        var bCount = (tmpSlice.match(/<{2}/g) || []).length; // Count Number of << in tmpSlice
        var eCount = (tmpSlice.match(/>{2}/g) || []).length; // Count Number of << in tmpSlice
        if (bCount > eCount) { // not ready yet
            if (getPosition(tmpSlice, '>>', i) < tmpSlice.length) { // there is more to parse
                i++;
                continue;
            } else if (getPosition(tmpSlice, '>>', i) >= tmpSlice.length) { // error, nth object not complete, move on i++
                break;
            }
        } else if (bCount == eCount) { // success <<count == >>count
            objects.push(tmpSlice);
            if (objectsString.length - tmpSlice.length > 0) { // there is more to parse
                objectsString = objectsString.substr(tmpSlice.length);
                i = 0;
            } else if (referenz.length / 2 != objects.length) { // objectsString is parsed completely
                console.log('WARNING:');
                console.log('Referenztable.length != Objectstable.length');
                console.log(referenz.length / 2 + '!=' + objects.length);
                console.log(objects)
                break;
            } else {
                break;
            }
        } else if (bCount < eCount) { // error
            console.log('WARNING: Something is wrong with the Object, return as much as possible!');
            console.log('bCount: ' + bCount + ' < eCount: ' + eCount);
            break;
        }
        i++;
    }
    var j
    for (j = 0; j < objects.length; j++) { // Get rid of content in array when Filter/DCTDecode and Subtype/Image
        objects[j].replace(/<<(.*?)?((\/Filter\/DCTDecode(.*?)?\/Subtype\/Image)|(\/Subtype\/Image(.*?)?\/Filter\/DCTDecode))(.*?)?>>(.*)/gi, '')
        rebuildedStream.push(objects[j]);
    }
    console.log(rebuildStream)
    return rebuildedStream;
}

// NOT NESTED
// rebuildStream (inflatedStream)
// Obj1 Gen(0) obj <<...>> content endobj
function rebuildStream(originalObject, inflatedStream) {
    
    // TODO CHECK IF stream....endstream ELSE do nothing and return rebuildedObject = array();
    // TODO Return just object content without <<....>> content
    var matchStart = getPosition(originalObject,'<<', 1);
    var matchEnd = getPosition(originalObject, '>>stream', 1) - 6;
    var objDef = originalObject.slice(matchStart, matchEnd)
    var rebuildedObject = objDef + '>>' + inflatedStream
    return rebuildedObject
}
