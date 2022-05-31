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
exports.channelUserSchama = exports.teamUserSchema = exports.readAllUserSchema = exports.changeUserStatusSchema = exports.createUserSessionSchema = exports.resetPasswordSchema = exports.updateUserAccess = exports.createUserSchema = void 0;
var yup_1 = require("yup");
var general_schema_1 = require("./general.schema");
var priviledges = [
    "DEPARTMENT",
    "MEMBERS",
    "TEAMS",
    "CHANNELS",
    "CATEGORY",
    "DEPARTMENT",
    "CREATE TICKET",
    "REQUESTER",
    "SUPPORT"
];
var payload = {
    body: yup_1.object({
        firstName: yup_1.string().required("First name is required"),
        lastName: yup_1.string().required("Last name is required"),
        departmentId: yup_1.string().required("Department is required"),
        unitId: yup_1.string(),
        password: yup_1.string()
            .required("Password is required")
            .min(6, "Password is too short - should be 6 chars minimum.")
            .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
        passwordConfirmation: yup_1.string().oneOf([yup_1.ref("password"), null], "Passwords must match"),
        email: yup_1.string()
            .email("Must be a valid email")
            .required("Email is required"),
        priviledge: yup_1.array().of(yup_1.string().oneOf(priviledges)),
    }),
};
var params = {
    params: yup_1.object({
        id: yup_1.string().required(),
    }),
};
exports.createUserSchema = yup_1.object(__assign({}, payload));
exports.updateUserAccess = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        priviledge: yup_1.array().of(yup_1.string().oneOf(priviledges)).required(),
    }) }));
exports.resetPasswordSchema = yup_1.object(__assign({}, params));
exports.createUserSessionSchema = yup_1.object({
    body: yup_1.object({
        password: yup_1.string().required("Password is required"),
        // .min(6, "Password is too short - should be 6 chars minimum.")
        // .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
        email: yup_1.string()
            .email("Must be a valid email")
            .required("Email is required"),
    }),
});
exports.changeUserStatusSchema = yup_1.object(__assign(__assign({}, params), { body: yup_1.object({
        isActive: yup_1.boolean().required("Status is required"),
    }) }));
exports.readAllUserSchema = yup_1.object(__assign({}, general_schema_1.query));
exports.teamUserSchema = yup_1.object(__assign({}, params));
exports.channelUserSchama = yup_1.object({
    query: yup_1.object({
        userId: yup_1.string().required(),
        channelId: yup_1.string().required()
    })
});
