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
exports.readOneTeamSchema = exports.readTeamSchema = exports.channgeTeamStatusSchema = exports.updateTeamSchema = exports.createTeamSchema = void 0;
var yup_1 = require("yup");
var general_schema_1 = require("./general.schema");
var payload = {
    body: yup_1.object({
        name: yup_1.string()
            .required("Team name is required")
            .min(5, "Team name is too short - should be 5 char minimum"),
    }),
};
var params = {
    params: yup_1.object({
        id: yup_1.string().required("ID is required!"),
    }),
};
exports.createTeamSchema = yup_1.object(__assign({}, payload));
exports.updateTeamSchema = yup_1.object(__assign({}, payload));
exports.channgeTeamStatusSchema = yup_1.object({
    body: yup_1.object({
        isActive: yup_1.bool().required("Status is required!"),
    }),
});
exports.readTeamSchema = yup_1.object(__assign({}, general_schema_1.query));
exports.readOneTeamSchema = yup_1.object(__assign({}, params));
