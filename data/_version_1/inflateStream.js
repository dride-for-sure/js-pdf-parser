/**
 * @ Author: Dennis Jauernig
 * @ Create Time: 2020-03-08 11:23:51
 * @ Modified by: Dennis Jauernig
 * @ Modified time: 2020-03-12 00:40:20
 * @ Description:
 */


function inflateStream(input) {
    var blob = pako.inflate(input);
    var strData =
        new Uint8Array(blob)
            .reduce((data, byte) => data + String.fromCharCode(byte), '');
    return strData;
}