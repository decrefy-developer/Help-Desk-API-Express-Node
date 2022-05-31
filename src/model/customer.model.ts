import mongoose, { AggregatePaginateModel, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

/**
 * interface for customerDocument
 *
 * @interface CustomerDocument
 * @name {string} name of the customer
 */
export interface CustomerDocument extends mongoose.Document {
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CustomerSchema.plugin(mongooseAggregatePaginate);

interface CustomerModel<T extends Document> extends AggregatePaginateModel<T> {}

const Customer: CustomerModel<CustomerDocument> =
  mongoose.model<CustomerDocument>(
    "Customer",
    CustomerSchema
  ) as CustomerModel<CustomerDocument>;

export default Customer;
