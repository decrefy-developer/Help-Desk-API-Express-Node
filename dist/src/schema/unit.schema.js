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
exports.changeUnitStatusSchema = exports.updateUnitNameSchema = exports.readAllUnitSchema = exports.readUnitSchema = exports.createUnitSchame = void 0;
var yup_1 = require("yup");
var payload = {
    body: yup_1.object({
        departmentId: yup_1.string().required("Department is required"),
        name: yup_1.string().required("Unit name is required"),
    })
};
var params = {
    params: yup_1.object({
        id: yup_1.string().required()
    })
};
exports.createUnitSchame = yup_1.object(__assign({}, payload));
exports.readUnitSchema = yup_1.object(__assign({}, params));
exports.readAllUnitSchema = yup_1.object({
    query: yup_1.object({
        page: yup_1.number().required().integer().positive(),
        limit: yup_1.number().required(),
        sort: yup_1.boolean(),
        search: yup_1.string(),
        status: yup_1.boolean(),
        departmentId: yup_1.string()
    }),
});
exports.updateUnitNameSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        name: yup_1.string().required("Unit name is required"),
    }) }));
exports.changeUnitStatusSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        isActive: yup_1.boolean().required("Status is required")
    }) }));
