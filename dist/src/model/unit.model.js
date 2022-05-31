"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
var UnitSchema = new mongoose_1.default.Schema({
    departmentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Department", require: true },
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
UnitSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
var Unit = mongoose_1.default.model("Units", UnitSchema);
exports.default = Unit;
