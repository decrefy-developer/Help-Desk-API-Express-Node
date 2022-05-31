import { AggregatePaginateResult, DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Request, { RequestDocument } from "../model/request.model";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export async function findRequest(query: FilterQuery<RequestDocument>) {
    const request = await Request.findOne(query)
    return request
}

export async function createRequest(input: DocumentDefinition<RequestDocument>) {
    const newRequest = await Request.create(input)
    return newRequest
}

export async function findRequestAndUpdate(query: FilterQuery<RequestDocument>, update: UpdateQuery<RequestDocument>, options: QueryOptions) {
    const updated = await Request.findByIdAndUpdate(query, update, options)
    return updated
}

export async function findAllRequestPagination(
    page: number,
    limit: number = 10,
    sort: boolean,
    search: string,
    userId: string,
    status: boolean) {

    const options = {
        page: page,
        limit: limit,
        // sort: { createdAt: -1 },
    };

    const stages: any = [
        {
            $lookup: {
                from: "users",
                let: { userId: "$userId" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                    { $project: { firstName: 1, lastName: 1, departmentId: 1, unitId: 1 } },
                ],
                as: "user"
            }
        },
        { $unset: ["userId"] },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "departments",
                let: { departmentId: "$user.departmentId" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$departmentId"] } } },
                    { $project: { name: 1 } }
                ],
                as: "department"
            }
        },
        {
            $lookup: {
                from: "units",
                let: { uId: "$user.unitId" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$uId"] } } },
                    { $project: { name: 1 } }
                ],
                as: "unit"
            }
        },
        {
            $lookup: {
                from: "tickets",
                let: { requestId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$requestId", "$$requestId"] } } },
                    { $project: { ticketNumber: 1, state: 1, userId: 1, targetDate: 1 } },
                    {
                        $lookup: {
                            from: "users",
                            let: { userId: "$userId" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                                { $project: { email: 1, firstName: 1, lastName: 1 } }
                            ],
                            as: "assignedSupport"
                        }
                    },
                    { $unset: "userId" },
                    { $unwind: { path: "$assignedSupport", preserveNullAndEmptyArrays: true } },
                ],
                as: "ticket"
            }
        },
        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$unit", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$ticket", preserveNullAndEmptyArrays: true } },
        {
            $addFields: { "user.unit": "$unit" }
        },
        {
            $addFields: { "user.department": "$department" }
        },
        { $unset: ["department", "unit", "user.departmentId", "user.unitId"] },
        {
            $match: {
                $or: [
                    { "ticket.ticketNumber": { $regex: new RegExp(search), $options: "i" } },
                    { concern: { $regex: new RegExp(search), $options: "i" } },
                ],
                "status": status
            }
        }
    ]

    if (userId) {
        stages.push({ $match: { "user._id": ObjectId(userId) } })
    }



    const myAggregate = Request.aggregate(stages);

    const requests = await Request.aggregatePaginate(
        myAggregate,
        options,
        function (err: any, result: AggregatePaginateResult<RequestDocument>) {
            if (!err) {
                return result;
            } else {
                console.log(err);
            }
        }
    );

    return requests;
}