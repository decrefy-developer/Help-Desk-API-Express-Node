import mongoose, { AggregatePaginateResult, DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Unit, { UnitDocument } from "../model/unit.model";

const ObjectId = mongoose.Types.ObjectId;

export async function createUnit(input: DocumentDefinition<UnitDocument>) {
    const newUnit = await Unit.create(input)
    return newUnit
}

export async function findUnit(query: FilterQuery<UnitDocument>) {
    const unit = await Unit.findOne(query)
    return unit
}

export async function findUnitAggregate() {

    const myAggregate = Unit.aggregate([
        {
            $lookup: {
                from: "departments",
                let: { dptId: "$departmentId" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$dptId"] } } },
                    { $project: { name: 1 } },
                ],
                as: "department",
            },
        },
        { $unset: ["departmentId"] },
        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },

    ])

    return myAggregate

}

export async function findAndUpdateUnit(query: FilterQuery<UnitDocument>, update: UpdateQuery<UnitDocument>, options: QueryOptions) {
    const updated = await Unit.findOneAndUpdate(query, update, options)
    return updated
}

export async function findAllUnitPagination(page: number,
    limit: number = 10,
    sort: boolean,
    search: string,
    isActive: boolean = true,
    departmentId: string) {


    const options = {
        page: page,
        limit: limit,
        sort: { createdAt: -1 }
    }

    const stages: any = [
        {
            $lookup: {
                from: "departments",
                let: { dptId: "$departmentId" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$dptId"] } } },
                    { $project: { name: 1 } },
                ],
                as: "department",
            },
        },
        { $unset: ["departmentId"] },
        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
        {
            $match: {
                $or: [{ name: { $regex: new RegExp(search), $options: "i" } }],
                isActive: isActive
            }
        }
    ]

    if (departmentId) {
        stages.push({ $match: { "department._id": ObjectId(departmentId) } })
    }

    const myAggregate = Unit.aggregate(stages)

    const Units = await Unit.aggregatePaginate(myAggregate, options,
        function (err: any, result: AggregatePaginateResult<UnitDocument>) {
            if (!err) {
                return result;
            } else {
                console.log(err)
            }
        })

    return Units
}