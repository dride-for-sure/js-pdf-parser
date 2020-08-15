/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-07-12 10:20:28
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-08-03 20:43:16
 * @ Description: Error Handling
 */

"use strict"

 /**
 * Error Handling
 *
 * @param {error,warning,log} type
 * @param {string} fct
 * @param {string} msg
 */
export function consoleLog(type, fct, msg) {
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

