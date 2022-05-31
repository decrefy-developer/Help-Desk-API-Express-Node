"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
var RequestSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    status: { type: Boolean, default: false },
    concern: { type: String }
}, { timestamps: true });
RequestSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
var Request = mongoose_1.default.model("Request", RequestSchema);
exports.default = Request;
