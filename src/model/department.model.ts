import mongoose, { AggregatePaginateModel, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


export interface DepartmentDocument extends mongoose.Document {
    name: string;
    isActive: Boolean;
    createdAt: Date;
    updatedAt: Date;
}


const Departmentschema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

Departmentschema.plugin(mongooseAggregatePaginate)

interface DepartmentModel<T extends Document> extends AggregatePaginateModel<T> { }

const Department: DepartmentModel<DepartmentDocument> = mongoose.model<DepartmentDocument>("Departments", Departmentschema) as DepartmentModel<DepartmentDocument>;

export default Department;