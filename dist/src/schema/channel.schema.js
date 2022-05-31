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
exports.ManageMemberToChannelSchema = exports.readMembersFromChannelSchema = exports.readChannelSchema = exports.changeChannelStatusSchema = exports.createChannelSchema = void 0;
var yup_1 = require("yup");
var general_schema_1 = require("./general.schema");
var payload = {
    body: yup_1.object({
        name: yup_1.string().required("Channel name is required"),
        teamId: yup_1.string().required("Team Id is required"),
        isActive: yup_1.boolean(),
    }),
};
var params = {
    params: yup_1.object({
        id: yup_1.string().required("ID is required!"),
    }),
};
exports.createChannelSchema = yup_1.object(__assign({}, payload));
exports.changeChannelStatusSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        isActive: yup_1.boolean().required("Status is required!"),
    }) }));
exports.readChannelSchema = yup_1.object(__assign({}, general_schema_1.query));
exports.readMembersFromChannelSchema = yup_1.object(__assign({}, params));
exports.ManageMemberToChannelSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        mode: yup_1.string().oneOf(["ADD", "REMOVE"]).required(),
        data: yup_1.object().shape({
            userId: yup_1.string().required(),
            email: yup_1.string().email().required("email is required!"),
            isAdmin: yup_1.boolean().required(),
        }),
    }) }));
