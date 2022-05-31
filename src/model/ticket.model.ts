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
import { RequestDocument } from "./request.model";
import { DepartmentDocument } from "./department.model";
import { SubCategoryDocument } from "./subCategory.model";

export interface TicketDocument extends mongoose.Document {
  ticketNumber: string;
  requestId: RequestDocument["_id"];
  departmentId: DepartmentDocument["_id"];
  requesterName: String;
  categoryID: CategoryDocument["_id"];
  SubCategoryId: Array<SubCategoryDocument["_id"]>;
  description: string;
  teamId: TeamDocument["_id"];
  channelId: ChannelDocument["_id"];
  state: string;
  doneDate: Date;
  solution: string;
  status: string;
  userId: UserDocument["_id"];
  coworkers: Array<UserDocument["_id"]>;
  seen: boolean;
  startDate: Date;
  targetDate: Date;
  closedDate: Date;
  comments: Array<IComment>;
  createdBy: UserDocument["_id"];
  closedBy: UserDocument["_id"];
  tags: Array<String>;
  createdAt: Date;
  updatedAt: Date;
  isFiled: Boolean;
  DateFiled: Date;
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
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    requesterName: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    SubCategoryId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    ],
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String, required: true },
    state: { type: String, required: true },
    doneDate: { type: Date, default: null },
    solution: { type: String },
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
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    comments: { type: Array },
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isFiled: { type: Boolean, default: false },
    DateFiled: { type: Date, default: null }
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

interface TicketModel<T extends Document> extends AggregatePaginateModel<T> { }

const Ticket: TicketModel<TicketDocument> = mongoose.model<TicketDocument>(
  "Ticket",
  TicketSchema
) as TicketModel<TicketDocument>;

export default Ticket;
