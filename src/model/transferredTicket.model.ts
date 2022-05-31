import mongoose, { AggregatePaginateModel, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { ChannelDocument } from "./channel.model";
import { TeamDocument } from "./team.model";
import { TicketDocument } from "./ticket.model";

export interface TransferredDocument extends mongoose.Document {
  ticketId: TicketDocument["_id"];
  ticketNumber: string;
  description: string;
  from: TeamChannel;
  to: TeamChannel;
  isApproved?: Boolean;
  dateApproved?: Date;
  remarks: string;
}

interface TeamChannel {
  teamId: TeamDocument["_id"],
  channelId?: ChannelDocument["_id"]
}

const TransferredTicketSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    ticketNumber: { type: String, required: true },
    description: { type: String, required: true },
    from: {
      teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
    },
    to: {
      teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", default: null }
    },
    isApproved: { type: Boolean, default: false },
    dateApproved: { type: Date, default: null },
    remarks: { type: String },
  },
  { timestamps: true }
);

TransferredTicketSchema.plugin(mongooseAggregatePaginate);

interface TransferredModel<T extends Document>
  extends AggregatePaginateModel<T> { }

const TransferredTicket: TransferredModel<TransferredDocument> =
  mongoose.model<TransferredDocument>(
    "Transfer",
    TransferredTicketSchema) as TransferredModel<TransferredDocument>;

export default TransferredTicket;
