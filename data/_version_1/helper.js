/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-24 10:17:19
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-28 18:25:56
 * @ Description:
 */

/**
 * Calculate the sum of all values in the array['string1',.....,'stringN']
 *
 * @param {array} input
 * @returns
 */
function calArrayStringLength(array) {
    let length = 0
    for (i = 0; i < array.length; i++) {
        length += String(array[i]).length
    }
    return length
}

/**
 * Get Position of a Substring
 *
 * @param {string} string
 * @param {string} regex (Escape!)
 * @param {string} index
 * @param {boolean} position (0 = before, 1 = after)
 * @returns
 */
function getPosition(string, regex, index, position) {
    let reg = new RegExp(regex, 'gims')
    let i = 1
    while ((match = reg.exec(string)) && i <= index) {
        if (i == index) {
            if (position == 1) {
                return match.index + match[0].length
                break
            } else {
                return match.index
                break
            }
        } else {
            i++
        }
    }
    consoleLog('error', 'getPosition', 'less matches then index')
}

/**
 * Regex ReplaceAll function
 *
 * @param {string} str
 * @param {string} find
 * @param {string} replace
 * @returns
 */
function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

/**
 * Escape all necessary RegEx chars
 *
 * @param {string} string
 * @returns
 */
function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

/**
 * Error Handling
 *
 * @param {string} type
 * @param {string} fct
 * @param {string} msg
 */
function consoleLog(type, fct, msg) {
    if (type == 'error') {
        console.error('fct: ' + fct + ' -> ' + msg)
    } else if (type == 'warning') {
        console.warn('fct: ' + fct + ' -> ' + msg)
    } else if (type == 'log') {
        console.log('fct: ' + fct + ' -> ' + msg)
    } else {
        consoleLog(error, 'consoleLog', 'undefined type')
    }
}