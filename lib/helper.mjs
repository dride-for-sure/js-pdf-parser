/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-08-03 15:50:55
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-08-18 17:58:31
 * @ Description: Helper
 */

"use strict"

import * as error from './error.mjs'

/**
 * Search For Symmetric Elements like _start XZ _end
 *
 * @param {string} _string
 * @param {regex} _start
 * @param {regex} _end
 * @param {boolean} _offset
 */

//TODO: Check offset value

export function searchForSymmetricElements(_string, _start, _end, _offset) {
    error.consoleLog('log', 'searchForSymmetricElements', '')
    let returnArray = new Array()
    let resultEnd = new Array()
    let resultStart = new Array()
    let matchEnd = new Array()
    let matchStart = new Array()
    let offset = new Array()
    let i, j = 0

    while (matchEnd = _end.exec(_string)) { // Build end match array
        resultEnd.push(matchEnd)
    }
    while (matchStart = _start.exec(_string)) { // Build start match array
        resultStart.push(matchStart)
    }

    for (i = 0; i < resultEnd.length; i++) { // Iterate over each end match
        let tmpString = _string.slice(resultStart[j].index, resultEnd[i].index + resultEnd[i][0].length)
        let countStart = (tmpString.match(_start) || []).length + j
        if (countStart == i + 1) {
            returnArray.push(tmpString)
            j = countStart
            offset[0] = resultEnd[i].index + resultEnd[i][0].length
        }
    }

    if (_offset == 1) {
        Array.prototype.push.apply(offset, returnArray)
        return offset
    } else {
        return returnArray
    }
}