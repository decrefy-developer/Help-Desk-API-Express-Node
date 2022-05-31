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
exports.deletePostSchema = exports.updatePostSchema = exports.createPostSchema = void 0;
var yup_1 = require("yup");
var payload = {
    body: yup_1.object({
        title: yup_1.string().required("Title is required"),
        body: yup_1.string()
            .required("Body is required")
            .min(120, "Body is too short - should be 120 chars minimum."),
    }),
};
var params = {
    params: yup_1.object({
        postId: yup_1.string().required("postId is required"),
    }),
};
exports.createPostSchema = yup_1.object(__assign({}, payload));
exports.updatePostSchema = yup_1.object(__assign(__assign({}, params), payload));
exports.deletePostSchema = yup_1.object(__assign({}, params));
