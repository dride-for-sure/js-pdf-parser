/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-07-12 10:18:01
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-08-03 18:11:54
 * @ Description: All Event Handlers
 */

"use strict"

import * as pdfObject from './pdfObject.mjs'

var input = document.getElementById("inputFile")
input.addEventListener("change", function () {
    console.log(this.files[0])
    pdfObject.pdfObject.parseChunk('./data/test_obj')
})
