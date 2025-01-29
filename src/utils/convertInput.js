const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const fs = require("fs");

const convertInput = (array) => {
    // scale the array by 10^9
    const scaledArray = array.map(x => x * 1e9);
    // convert to int
    const intArray = scaledArray.map(x => parseInt(x));
    // perform array.map(x => Fr.e(x).toString());
    const stringArray = intArray.map(x => Fr.e(x).toString());
    return stringArray;
}

// export the function
module.exports = convertInput;

