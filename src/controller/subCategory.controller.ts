import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import { findCategory } from "../service/category.service";
import { createSubCategory, findAllSubCategory, findAndUpdate, findSubCategory } from "../service/subCategory.service";
import { ToBoolean } from "../utils/toBoolean";


export async function createSubCategoryHandlerJ(req: Request, res: Response) {
    try {
        const name = get(req, "body.name")
        const categoryId = get(req, "body.categoryId")

        const isExist = await findSubCategory({ $and: [{ name: name }, { categoryId: categoryId }] })
        if (isExist) return res.status(409).send({ message: `${name} is already exist!` })

        const isCategoryExist = await findCategory({ _id: categoryId })
        if (!isCategoryExist) return res.send({ message: "category not found!" })

        const newData = await createSubCategory(req.body)

        res.send(newData)
    } catch (e: any) {
        log.error(e)
        return res.send(e.message)
    }
}

export async function readSubCategoryHandler(req: Request, res: Response) {
    try {
        let page = get(req, "query.page") as number;
        const limit = get(req, "query.limit") as number;
        const sort = get(req, "query.sort") as boolean;
        const search = get(req, "query.search") as string;
        const status = get(req, "query.status");
        const categoryId = get(req, "query.categoryId") as string;

        if (search !== "") page = 1; // turns back the page into 1

        const isActive = ToBoolean(status);

        const result = await findAllSubCategory(page, limit, sort, search, isActive, categoryId)
        return res.send(result)
    } catch (e: any) {
        log.error(e)
        return res.send(e.message)
    }
}


export async function updateSubCategoryHandler(req: Request, res: Response) {
    try {
        const id = get(req, "params.id")

        const isExist = await findSubCategory({ _id: id })
        if (!isExist) return res.send({ message: "item not found!" })

        const result = await findAndUpdate({ _id: id }, req.body, { new: true })

        return res.send(result)
    }
    catch (e: any) {
        log.error(e)
        return res.send(e.message)
    }
}