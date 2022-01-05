import mongoose, { Document, AggregatePaginateModel } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface TeamDocument extends mongoose.Document {
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TeamSchema.plugin(mongooseAggregatePaginate);

interface TeamModel<T extends Document> extends AggregatePaginateModel<T> {}

const Team: TeamModel<TeamDocument> = mongoose.model<TeamDocument>(
  "Team",
  TeamSchema
) as TeamModel<TeamDocument>;

export default Team;
