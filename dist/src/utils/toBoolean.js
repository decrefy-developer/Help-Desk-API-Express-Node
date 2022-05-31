"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToBoolean = void 0;
//funtion change to boolean
function ToBoolean(status) {
    var result;
    if (status === "true") {
        result = true;
    }
    else if (!status) {
        result = true;
    }
    else {
        result = false;
    }
    return result;
}
exports.ToBoolean = ToBoolean;
