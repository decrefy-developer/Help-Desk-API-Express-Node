import {
  AggregatePaginateResult,
  DocumentDefinition,
  FilterQuery,
  Query,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Category, { CategoryDocument } from "../model/category.model";

export async function findCategory(query: FilterQuery<CategoryDocument>) {
  const category = await Category.findOne(query);

  return category;
}

export async function createCategory(
  input: DocumentDefinition<CategoryDocument>
) {
  const newCategory = await Category.create(input);
  return newCategory;
}

export async function findAllCategory(
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

  const myAggregate = Category.aggregate([
    {
      $match: {
        $or: [{ name: { $regex: new RegExp(search), $options: "i" } }],
      },
    },
  ]);

  const categories = await Category.aggregatePaginate(
    myAggregate,
    options,
    function (err: any, result: AggregatePaginateResult<CategoryDocument>) {
      if (!err) {
        return result;
      } else {
        console.log(err);
      }
    }
  );

  return categories;
}

export async function findAndUpdate(
  query: FilterQuery<CategoryDocument>,
  update: UpdateQuery<CategoryDocument>,
  options: QueryOptions
) {
  const updated = await Category.findByIdAndUpdate(query, update, options);
  return updated;
}
