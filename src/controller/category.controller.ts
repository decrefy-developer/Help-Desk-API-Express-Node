import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import Category from "../model/category.model";
import {
  createCategory,
  findAllCategory,
  findAndUpdate,
  findCategory,
} from "../service/category.service";
import { aggregate } from "../service/templates";

export async function createCategoryHandler(req: Request, res: Response) {
  try {
    const name = get(req.body, "name");

    const ifExist = await findCategory({ name });
    if (ifExist) return res.send({ message: "Name is already exist!" });

    const newCategory = await createCategory(req.body);

    return res.send(newCategory);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function readAllCategoryHandler(req: Request, res: Response) {
  try {
    const page = get(req, "query.page") as number;
    const limit = get(req, "query.limit") as number;
    const sort = get(req, "query.sort") as boolean;
    const search = get(req, "query.search") as string;

    const categories = await findAllCategory(page, limit, sort, search);

    return res.send(categories);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function readOneCategoryHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");

    const category = await findCategory({ _id: id });

    if (!category) return res.send({ message: "No Category Found!" });

    return res.send(category);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function updateCategoryHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");

    const update = await findAndUpdate({ _id: id }, req.body, { new: true });

    return res.send(update);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}

export async function changeCategoryStatusHandler(req: Request, res: Response) {
  try {
    const id = get(req, "params.id");
    const updated = await findAndUpdate({ _id: id }, req.body, { new: true });

    return res.send(updated);
  } catch (error: any) {
    log.error(error);
    return res.send(error.message);
  }
}
