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
exports.changeStatusSchema = exports.updateDepartmentNameSchema = exports.readAllDepartmentsSchema = exports.readDepartmentSchema = exports.createDepartmentSchema = void 0;
var yup_1 = require("yup");
var general_schema_1 = require("./general.schema");
var payload = {
    body: yup_1.object({
        name: yup_1.string().required("Department name is required"),
        isActive: yup_1.boolean(),
    })
};
var params = {
    params: yup_1.object({
        id: yup_1.string().required()
    })
};
exports.createDepartmentSchema = yup_1.object(__assign({}, payload));
exports.readDepartmentSchema = yup_1.object(__assign({}, params));
exports.readAllDepartmentsSchema = yup_1.object(__assign({}, general_schema_1.query));
exports.updateDepartmentNameSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        name: yup_1.string().required("Department name is required")
    }) }));
exports.changeStatusSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        isActive: yup_1.boolean().required("Status is required")
    }) }));
