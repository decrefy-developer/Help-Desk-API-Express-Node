import mongoose, { AggregatePaginateModel, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { DepartmentDocument } from "./department.model";


export interface UnitDocument extends mongoose.Document {
    departmentId: DepartmentDocument['_id']
    name: string;
    isActive: Boolean;
    createdAt: Date;
    updatedAt: Date;
}


const UnitSchema = new mongoose.Schema({
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", require: true },
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

UnitSchema.plugin(mongooseAggregatePaginate)

interface UnitModel<T extends Document> extends AggregatePaginateModel<T> { }

const Unit: UnitModel<UnitDocument> = mongoose.model<UnitDocument>("Units", UnitSchema) as UnitModel<UnitDocument>;

export default Unit;