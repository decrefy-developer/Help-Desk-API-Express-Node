import mongoose, { AggregatePaginateModel, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { CategoryDocument } from "./category.model";


export interface SubCategoryDocument extends mongoose.Document {
    categoryId: CategoryDocument['_id']
    name: string;
    isActive: Boolean;
    createdAt: Date;
    updatedAt: Date;
}


const SubCategorySchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", require: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

SubCategorySchema.plugin(mongooseAggregatePaginate)

interface SubCategoryModel<T extends Document> extends AggregatePaginateModel<T> { }

const SubCategory: SubCategoryModel<SubCategoryDocument> = mongoose.model<SubCategoryDocument>("SubCategory", SubCategorySchema) as SubCategoryModel<SubCategoryDocument>;

export default SubCategory;