"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
var Departmentschema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
Departmentschema.plugin(mongoose_aggregate_paginate_v2_1.default);
var Department = mongoose_1.default.model("Departments", Departmentschema);
exports.default = Department;
