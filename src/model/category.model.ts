import mongoose, { AggregatePaginateModel, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface CategoryDocument extends mongoose.Document {
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.plugin(mongooseAggregatePaginate);

interface CategoryModel<T extends Document> extends AggregatePaginateModel<T> {}

const Category: CategoryModel<CategoryDocument> =
  mongoose.model<CategoryDocument>(
    "Category",
    CategorySchema
  ) as CategoryModel<CategoryDocument>;

export default Category;
