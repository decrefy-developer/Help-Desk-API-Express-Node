import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import { createRequest, findAllRequestPagination, findRequest, findRequestAndUpdate } from "../service/request.service";
import { ToBoolean } from "../utils/toBoolean";



export async function createRequestHandler(req: Request, res: Response) {
    try {
        const newRequest = await createRequest(req.body)

        return res.send(newRequest)
    } catch (error: any) {
        log.error(error);
        return res.send(error.message);
    }
}


export async function readRequestHandler(req: Request, res: Response) {
    try {
        const page = get(req, "query.page") as number;
        const limit = get(req, "query.limit") as number;
        const sort = get(req, "query.sort") as boolean;
        const search = get(req, "query.search") as string;
        const userId = get(req, "query.userId") as string;
        const status = get(req, "query.status")


        const requests = await findAllRequestPagination(page, limit, sort, search, userId, ToBoolean(status))

        return res.send(requests)
    } catch (error: any) {
        log.error(error);
        return res.send(error.message);
    }
}

export async function updateRequestHandler(req: Request, res: Response) {
    try {

        const id = get(req, "params.id") as string;

        const request = await findRequest({ _id: id })


        if (!request) {
            return res.send({ message: "no request found" })
        }

        const updated = await findRequestAndUpdate({ _id: id }, req.body, { new: true })

        return res.send(updated)
    } catch (error: any) {
        log.error(error);
        return res.send(error.message);
    }
}