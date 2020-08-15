/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-07-12 10:18:01
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-08-03 18:48:48
 * @ Description: All Event Handlers
 */

"use strict"

import * as pdfObject from './pdfObject.mjs'

var input = document.getElementById("inputFile")
input.addEventListener("change", function () {
    pdfObject.pdfObject.parseChunk(this.files[0])
})
