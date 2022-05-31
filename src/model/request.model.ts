import mongoose, { AggregatePaginateModel, Document } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { UserDocument } from './user.model'


export interface RequestDocument extends mongoose.Document {
    userId: UserDocument["_id"]
    concern: string;
    status: Boolean;
    createdAt: Date;
    updatedAt: Date;
}

const RequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Boolean, default: false },
    concern: { type: String }
}, { timestamps: true })

RequestSchema.plugin(mongooseAggregatePaginate);

interface RequestModel<T extends Document> extends AggregatePaginateModel<T> { }

const Request: RequestModel<RequestDocument> = mongoose.model<RequestDocument>("Request", RequestSchema) as RequestModel<RequestDocument>;

export default Request;
