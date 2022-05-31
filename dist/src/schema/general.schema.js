"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
var yup_1 = require("yup");
exports.query = {
    query: yup_1.object({
        page: yup_1.number().required().integer().positive(),
        limit: yup_1.number().required(),
        sort: yup_1.boolean(),
        search: yup_1.string(),
        status: yup_1.boolean(),
    }),
};
