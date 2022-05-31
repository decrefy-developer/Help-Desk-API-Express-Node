import mongoose, { AggregatePaginateModel, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { TeamDocument } from "./team.model";
import { UserDocument } from "./user.model";

export interface ChannelDocument extends mongoose.Document {

  name: string;
  teamId: TeamDocument["_id"];
  members: Array<IMember>;
  isActive: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMember {
  userId: UserDocument["id"];
  email: String;
  isAdmin: Boolean;
}

const ChannelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        email: { type: String, default: false },
        isAdmin: { type: Boolean, default: false },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ChannelSchema.plugin(mongooseAggregatePaginate);

interface ChannelModel<T extends Document> extends AggregatePaginateModel<T> { }

const Channel: ChannelModel<ChannelDocument> = mongoose.model<ChannelDocument>(
  "Channel",
  ChannelSchema
) as ChannelModel<ChannelDocument>;

export default Channel;
