"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
var ChannelSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    teamId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Team" },
    members: [
        {
            userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
            email: { type: String, default: false },
            isAdmin: { type: Boolean, default: false },
        },
    ],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
ChannelSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
var Channel = mongoose_1.default.model("Channel", ChannelSchema);
exports.default = Channel;
