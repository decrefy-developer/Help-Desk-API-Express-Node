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
exports.readOneSubSchema = exports.readSubCategorySchema = exports.changeSubStatusSchema = exports.updateSubCategory = exports.createSubCategorySchema = void 0;
var yup_1 = require("yup");
var payload = {
    body: yup_1.object({
        categoryId: yup_1.string().required("Category is required"),
        name: yup_1.string().required("Sub-category name is required"),
        isActive: yup_1.boolean(),
    })
};
var params = {
    params: yup_1.object({
        id: yup_1.string().required('ID is required')
    })
};
exports.createSubCategorySchema = yup_1.object(__assign({}, payload));
exports.updateSubCategory = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        name: yup_1.string().required("Sub-category name is required"),
    }) }));
exports.changeSubStatusSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        isActive: yup_1.boolean().required("Status is required"),
    }) }));
exports.readSubCategorySchema = yup_1.object({
    query: yup_1.object({
        page: yup_1.number().required().integer().positive(),
        limit: yup_1.number().required(),
        sort: yup_1.boolean(),
        search: yup_1.string(),
        status: yup_1.boolean(),
        categoryId: yup_1.string()
    }),
});
exports.readOneSubSchema = yup_1.object(__assign({}, params));
