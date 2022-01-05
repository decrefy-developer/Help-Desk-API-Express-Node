import {
  AggregatePaginateResult,
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Customer, { CustomerDocument } from "../model/customer.model";

export async function createCustomer(
  input: DocumentDefinition<CustomerDocument>
) {
  const newCustomer = await Customer.create(input);
  return newCustomer;
}

export async function findAllCustomer(
  page: number,
  limit: number = 10,
  sort: boolean,
  search: string
) {
  const options = {
    page: page,
    limit: limit,
    sort: { name: sort ? -1 : 1, createdAt: -1 },
  };
  const myAggregate = Customer.aggregate([
    {
      $match: {
        $or: [{ name: { $regex: new RegExp(search), $options: "i" } }],
      },
    },
  ]);

  const customer = await Customer.aggregatePaginate(
    myAggregate,
    options,
    function (err: any, result: AggregatePaginateResult<CustomerDocument>) {
      if (!err) {
        return result;
      } else {
        console.log(err);
      }
    }
  );

  return customer;
}

export async function findCustomer(query: FilterQuery<CustomerDocument>) {
  return await Customer.findOne(query);
}

export async function findAndUpdate(
  query: FilterQuery<CustomerDocument>,
  update: UpdateQuery<CustomerDocument>,
  option: QueryOptions
) {
  const updated = await Customer.findByIdAndUpdate(query, update, option);

  return updated;
}
