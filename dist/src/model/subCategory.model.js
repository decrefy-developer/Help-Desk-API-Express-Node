"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
var SubCategorySchema = new mongoose_1.default.Schema({
    categoryId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category", require: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
SubCategorySchema.plugin(mongoose_aggregate_paginate_v2_1.default);
var SubCategory = mongoose_1.default.model("SubCategory", SubCategorySchema);
exports.default = SubCategory;
