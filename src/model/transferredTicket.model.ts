import mongoose, { AggregatePaginateModel, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { TicketDocument } from "./ticket.model";
import { UserDocument } from "./user.model";

export interface TransferredDocument extends mongoose.Document {
  ticketId: TicketDocument["_id"];
  ticketNumber: string;
  description: string;
  targetDate: Date;
  requestedBy: UserDocument["_id"];
  remarks?: string;
  isDone?: Boolean;
}

const TransferredTicketSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    ticketNumber: { type: String, required: true },
    description: { type: String, required: true },
    targetDate: { type: Date, required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    remarks: { type: String },
    isDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TransferredTicketSchema.plugin(mongooseAggregatePaginate);

interface TransferredModel<T extends Document>
  extends AggregatePaginateModel<T> {}

const TransferredTicket: TransferredModel<TransferredDocument> =
  mongoose.model<TransferredDocument>(
    "Transfer",
    TransferredTicketSchema
  ) as TransferredModel<TransferredDocument>;

export default TransferredTicket;
