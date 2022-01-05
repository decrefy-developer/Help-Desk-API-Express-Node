import mongoose, {
  AggregatePaginateModel,
  Document,
  HookNextFunction,
} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import moment from "moment";
import { ChannelDocument } from "./channel.model";
import { UserDocument } from "./user.model";
import { TeamDocument } from "./team.model";
import { CustomerDocument } from "./customer.model";
import { CategoryDocument } from "./category.model";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { getNextTicketId } from "../service/ticket.service";

export interface TicketDocument extends mongoose.Document {
  ticketNumber: string;
  teamId: TeamDocument["_id"];
  channelId: ChannelDocument["_id"];
  customerId: CustomerDocument["_id"];
  categoryID: CategoryDocument["_id"];
  userId: UserDocument["_id"];
  description: string;
  state: string;
  doneDate: Date;
  status: string;
  coworkers: Array<UserDocument["_id"]>;
  seen: boolean;
  startDate: Date;
  targetDate: Date;
  closedDate: Date;
  comments: Array<IComment>;
  createdBy: UserDocument["_id"];
  tags: Array<String>;
  createdAt: Date;
  updatedAt: Date;
}

interface IComment {
  userId: UserDocument["_id"];
  message: string;
  createdAt: Date;
}

const dateNow = moment().format("MMDDYY");

const TicketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, default: null },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String, required: true },
    state: { type: String, required: true },
    doneDate: { type: Date, default: null },
    coworkers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    seen: { type: Boolean, default: false },
    startDate: { type: Date },
    targetDate: { type: Date },
    status: { type: String, required: true },
    closedDate: { type: Date, default: null },
    comments: { type: Array },
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

TicketSchema.pre("save", async function name(next: HookNextFunction) {
  let ticket = this as TicketDocument;
  let generated: number = 1;

  const getTicketId = await getNextTicketId();

  console.log("please", getTicketId?.ticketNumber);

  if (getTicketId?.ticketNumber == undefined) {
    generated = 1;
  } else {
    generated = Number(getTicketId?.ticketNumber) + 1;
  }

  ticket.ticketNumber = generated.toString();

  return next();
});

TicketSchema.plugin(mongooseAggregatePaginate);

interface TicketModel<T extends Document> extends AggregatePaginateModel<T> {}

const Ticket: TicketModel<TicketDocument> = mongoose.model<TicketDocument>(
  "Ticket",
  TicketSchema
) as TicketModel<TicketDocument>;

export default Ticket;
