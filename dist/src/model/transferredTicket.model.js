"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
var TransferredTicketSchema = new mongoose_1.default.Schema({
    ticketId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Ticket" },
    ticketNumber: { type: String, required: true },
    description: { type: String, required: true },
    from: {
        teamId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Team" },
        channelId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Channel" }
    },
    to: {
        teamId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Team" },
        channelId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Channel", default: null }
    },
    isApproved: { type: Boolean, default: false },
    dateApproved: { type: Date, default: null },
    remarks: { type: String },
}, { timestamps: true });
TransferredTicketSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
var TransferredTicket = mongoose_1.default.model("Transfer", TransferredTicketSchema);
exports.default = TransferredTicket;
