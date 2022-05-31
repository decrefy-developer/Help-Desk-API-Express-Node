"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRequestSchema = exports.readRequestSchema = exports.createRequestSchema = void 0;
var yup_1 = require("yup");
var payload = {
    body: yup_1.object({
        userId: yup_1.string().required("user is  required"),
        concern: yup_1.string().required("Concern is required")
    }),
};
var params = {
    params: yup_1.object({
        id: yup_1.string().required("ID is required!"),
    }),
};
exports.createRequestSchema = yup_1.object(__assign({}, payload));
exports.readRequestSchema = yup_1.object({
    query: yup_1.object({
        page: yup_1.number().required().integer().positive(),
        limit: yup_1.number().required(),
        status: yup_1.boolean().required(),
        sort: yup_1.boolean(),
        search: yup_1.string(),
        userId: yup_1.string()
    }),
});
exports.updateRequestSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({ status: yup_1.boolean().required() }) }));
