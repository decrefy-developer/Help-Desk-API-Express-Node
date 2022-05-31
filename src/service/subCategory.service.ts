import mongoose, { FilterQuery, QueryOptions, AggregatePaginateResult, UpdateQuery, DocumentDefinition } from "mongoose"
import SubCategory, { SubCategoryDocument } from "../model/subCategory.model"

const ObjectId = mongoose.Types.ObjectId;

export async function createSubCategory(input: DocumentDefinition<SubCategoryDocument>) {
    const newdata = await SubCategory.create(input)
    return newdata
}

export async function findSubCategory(query: FilterQuery<SubCategoryDocument>) {
    const result = await SubCategory.findOne(query)
    return result
}

export async function findAndUpdate(
    query: FilterQuery<SubCategoryDocument>,
    update: UpdateQuery<SubCategoryDocument>,
    options: QueryOptions) {

    const updated = await SubCategory.findOneAndUpdate(query, update, options)
    return updated
}

export async function findAllSubCategory(
    page: number,
    limit: number = 10,
    sort: boolean,
    search: string,
    isActive: boolean = true,
    categoryId: string) {

    const options = {
        page: page,
        limit: limit,
        sort: { createdAt: -1 }
    }

    const stages: any = [
        {
            $lookup: {
                from: "categories",
                let: { categoryId: "$categoryId" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$categoryId"] } } },
                    { $project: { name: 1 } },
                ],
                as: "category",
            },
        },
        { $unset: ["categoryId"] },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
            $match: {
                $or: [{ name: { $regex: new RegExp(search), $options: "i" } }],
                isActive: isActive
            }
        }
    ]

    if (categoryId) {
        stages.push({ $match: { "category._id": ObjectId(categoryId) } })
    }

    const myAggregate = SubCategory.aggregate(stages)

    const result = await SubCategory.aggregatePaginate(myAggregate, options,
        function (err: any, result: AggregatePaginateResult<SubCategoryDocument>) {
            if (!err) {
                return result;
            } else {
                console.log(err)
            }
        })

    return result
}
