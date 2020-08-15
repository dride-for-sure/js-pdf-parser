/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-07-12 10:10:29
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-08-16 00:01:48
 * @ Description: PDF object tree for a preflight
 */

"use strict"

import * as helper from './helper.mjs'
import * as error from './error.mjs'
import * as testObj from './testObj.mjs'

export let pdfObject = {

    /**
     * Main object function
     *
     * @param {string} file
     */

    readlocal: function (testObj) {
        error.consoleLog('log', 'mainfct', '')
        let fitChunk = this.fitChunk(testObj)
        if (fitChunk.length > 1) { // At least one object was found
            fitChunk = this.inflateObj(fitChunk)
            console.log(fitChunk)
            let objArray = this.generateObj(fitChunk)
            objArray = this.cleanObj(objArray)
            this.pdfTree.add(objArray)
            offset += chunk.length // Move pointer forward
        } else { // No object was found
            chunkSize += chunkSize // Double chunkSize (to match big image objects really fast)
        }
    },

    /**
     * Main object function
     *
     * @param {string} file
     */

    parseChunk: function (file) {
        error.consoleLog('log', 'parseChunk', '')
        let chunkSize = 1024 * 1024 * 1 // 1MB
        const maxChunkSize = chunkSize * 300 // 300MB
        let offset = 0 // Pointer at start
        while (offset <= file.size) { // Some bytes left 
            let chunk = this.readChunk(file, offset, chunkSize, maxChunkSize)
            let fitChunk = this.fitChunk(chunk)
            if (fitChunk.length !== 0) { // At least one object was found
                fitChunk = this.inflateObj(fitChunk)
                objArray = this.separateObj(fitChunk)
                objArray = this.cleanObj(objArray)
                this.pdfTree.add(objArray)
                offset += chunk.length // Move pointer forward
            } else { // No object was found
                chunkSize += chunkSize // Double chunkSize (to match big image objects really fast)
            }
        }
    },

    /**
     * FileReader with chunk
     *
     * @param {string} _file
     * @param {number} _offset
     * @param {number} _chunkSize
     * @param {number} _maxChunkSize
     */

    readChunk: function (_file, _offset, _chunkSize, _maxChunkSize) {
        error.consoleLog('log', 'readChunk', '')
        let readBlock = null
        let onLoadHandler = null
        onLoadHandler = function (evt) {
            if (evt.target.error == null) { // Read something
                return evt.target.result
            } else if (evt.target.error !== null) { // Read nothing <-- TODO: Check !== ?
                error.consoleLog('error', 'onLoadHandler', 'evt.target.error')
                return // Return Error
            }
            readBlock(_file, _offset, _chunkSize) // Next chunk
        }
        readBlock = function (_file, _offset, _chunkSize) {
            let fileReader = new FileReader()
            let blob = _file.slice(_offset, _offset + _chunkSize)
            fileReader.onload = onLoadHandler
            fileReader.readAsBinaryString(blob) // Read as binary string is important
        }
    },

    /**
     * Isolate the objects & calculate offset
     *
     * @param {string} _chunk
     * @returns {string} fitChunk
     */

    fitChunk: function (_chunk) {
        error.consoleLog('log', 'fitChunk', '')
        let fitChunk = helper.searchForSymmetricElements(_chunk, /\d{1,4}\s+\d{1,2}\s+obj[\s+]?/g, /(endobj)/g, 1)
        return fitChunk
    },

    /**
     * Inflate the Objects (Filter/Deflate)
     *
     * @param {array} _fitChunk
     * @returns {array} objArray
     */

    inflateObj: function (_fitChunk) {
        error.consoleLog('log', 'inflateObj', '')
        let objArray = []
        for (let i = 0; i < _fitChunk.length; i++) {
            if (String(_fitChunk[i]).match(/(FlateDecode)/)) {
                let stream = _fitChunk[i].match(/(>>)(\s+)?(stream)(.*)(\s+)?(endstream)/)
                /*let blob = _pako.inflate(stream[4])
                let inflatedStream = new Uint8Array(blob).reduce((data, byte) => data + String.fromCharCode(byte), '');*/
                let inflatedStream = stream[4]
                objArray.push(inflatedStream)
            }
        }
        return objArray
    },

    /**
     * Generate Objects
     *
     * @param {array} _chunk
     * @returns {array}  
     */

    generateObj: function (_objArray) { // Separate the Objects
        error.consoleLog('log', 'generateObj', '')
        return separateObjArray
    },

    /**
         * Clean the Object to reduce memory consumption
         *
         * @param {array} _objArray
         * @returns
         */
        
    cleanObj: function (_objArray) {
        error.consoleLog('log', 'cleanObj', '')
    },

    /**
     * Split the object metatags in array
     *
     * @param {string} _objTags
     * @returns {array} objTagsArray
     */

    splitObjTags: function (_objTags) {
        error.consoleLog('log', 'splitObjTags', '')
        let objTagsArray = new Array()
        let match = (_objTags + '/').match(/((?<=\/)(((?!\/).)*?)<+(.*?)>+(?=\/))|((?<=\/)(((?!\/).)*?)(?=\/))/g) // Trailing slash for regexp
        if (match !== null) {
            for (let i = 0; i < match.length; i++) {
                let meta = match[i].match(/((((?!(\/)|>+|\[|\{).)*?)((?=<+)|(?=\/)|$))/g)
                let subMeta = helper.searchForSymmetricElements(match[i], /<{1,2}/g, />{1,2}/g)
                if (subMeta !== undefined) {
                    objTagsArray.push([meta[0], subMeta[0].slice(3, -2)]) // Clean up <</ & >>
                } else (
                    objTagsArray.push([meta[0]])
                )
            }
            return objTagsArray
        } else {
            return [_objTags] // Return the objTags itself
        }
    },
    pdfSummary: function () {
        error.consoleLog('log', 'pdfSummary', '')
    },
    preflight: function () {
        error.consoleLog('log', 'preflight', '')
    },
    pdfTree: {
        objArray: [], // [obj1...objN]
        add: function (obj) { // Add to objArray
            error.consoleLog('log', 'pdfTree.add', '')
        }
    }
}

pdfObject.readlocal(testObj.testObj)