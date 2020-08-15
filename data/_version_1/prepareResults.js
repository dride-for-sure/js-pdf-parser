/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-08 11:18:21
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-23 20:08:28
 * @ Description:
 */

// Filter Objects Array for interesting Items -> discard rest
function prepareResults(input) {

    console.log('Prepare Results')
    var results = new Array()

    const regexObjects = new RegExp(/(TrimBox|(XML[\s+]?\/Metadata)|OutputIntent)/, 'i')
    results = input.filter((object) => {
        return regexObjects.test(object)
    })

    console.log('> This are the results:')

    return results
}