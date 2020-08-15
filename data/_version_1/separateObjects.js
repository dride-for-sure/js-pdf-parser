/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-23 16:18:49
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-23 21:57:06
 * @ Description:
 */

function separateObjects(input) {
    var output = new Array();
    var singleObject
    var objCount
    var endobjCount
    var i,j = 1

    for (i = 1; i <= (input.match(/endobj/g) || []).length; i++) {
        singleObject = input.slice( // Slice from obj_j to endobj_i
            input.split(/(?<!end)obj/gs, j).join('obj').length,
            getPosition(input, 'endobj', i) + 6
        )
        objCount = (singleObject.match(/(?<!end)obj/g) || []).length // Count obj
        endobjCount = (singleObject.match(/endobj/g) || []).length // Count endobj
        if (objCount = endobjCount) { // when count obj = count endobj
            console.log('Extract single Object')
            output.push(singleObject) // output = array()
            j += endobjCount
        } else if (objCount < endobjCount) {
            console.log('Error: objCount < endobjCount (fn: separateObjects)')
            break
        }
    }
    return output
}