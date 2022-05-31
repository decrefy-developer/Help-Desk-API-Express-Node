import { AggregatePaginateResult, DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Department, { DepartmentDocument } from "../model/department.model";



export async function createDepartment(input: DocumentDefinition<DepartmentDocument>) {
    const newDepartment = await Department.create(input)
    return newDepartment
}

export async function findDepartment(query: FilterQuery<DepartmentDocument>) {
    const department = await Department.findOne(query)
    return department
}

export async function findAllDepartment(
    page: number,
    limit: number = 10,
    sort: boolean,
    search: string,
    isActive: boolean = true) {

    const options = {
        page: page,
        limit: limit,
        sort: { createdAt: -1 }
    }

    const myAggregate = Department.aggregate([
        {
            $match: {
                $or: [{ name: { $regex: new RegExp(search), $options: "i" } }],
                isActive: isActive
            }
        }
    ])

    const departments = await Department.aggregatePaginate(myAggregate, options,
        function (err: any, result: AggregatePaginateResult<DepartmentDocument>) {
            if (!err) {
                return result;
            } else {
                console.log(err)
            }
        })

    return departments
}

export async function findAndUpdate(
    query: FilterQuery<DepartmentDocument>,
    update: UpdateQuery<DepartmentDocument>,
    options: QueryOptions) {

    const updated = await Department.findOneAndUpdate(query, update, options)
    return updated
}



