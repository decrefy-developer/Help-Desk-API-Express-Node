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
exports.readOneCategorySchema = exports.readCategorySchema = exports.changeCategoryStatusSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
var yup_1 = require("yup");
var general_schema_1 = require("./general.schema");
var payload = {
    body: yup_1.object({
        name: yup_1.string().required("Category Name is required!"),
    }),
};
var params = {
    params: yup_1.object({
        id: yup_1.string().required("ID is required!"),
    }),
};
exports.createCategorySchema = yup_1.object(__assign({}, payload));
exports.updateCategorySchema = yup_1.object(__assign({}, payload));
exports.changeCategoryStatusSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        isActive: yup_1.boolean().required("Status is required"),
    }) }));
exports.readCategorySchema = yup_1.object(__assign({}, general_schema_1.query));
exports.readOneCategorySchema = yup_1.object(__assign({}, params));
