import { Request, Response } from "express"
import { get } from "lodash"
import log from "../logger"
import { findDepartment } from "../service/department.service"
import { createUnit, findAllUnitPagination, findAndUpdateUnit, findUnit, findUnitAggregate } from "../service/unit.service"
import { ToBoolean } from "../utils/toBoolean"



export async function createUnitHandler(req: Request, res: Response) {
    try {
        const departmentId = get(req.body, "departmentId")

        const department = await findDepartment({ _id: departmentId })

        if (!department) return res.send({ message: "No department found!" })

        const newUnit = await createUnit(req.body)
        return res.send(newUnit)
    } catch (e: any) {
        log.error(e)
        return res.send(e.message)
    }
}

export async function readUnitHandler(req: Request, res: Response) {
    try {
        const id = get(req, "params.id")

        const unit = await findUnit({ _id: id })
        if (!unit) {
            return res.send({ message: 'No unit found!' })
        }

        return res.send(unit)

        // const result = await findUnitAggregate()

        // return res.send(result[0])
    } catch (e: any) {
        log.error(e)
        return res.send(e.message)
    }
}


export async function readAllUnitHandler(req: Request, res: Response) {
    try {
        let page = get(req, "query.page") as number;
        const limit = get(req, "query.limit") as number;
        const sort = get(req, "query.sort") as boolean;
        const search = get(req, "query.search") as string;
        const status = get(req, "query.status");
        const departmentId = get(req, "query.departmentId") as string;

        if (search !== "") page = 1; // turns back the page into 1

        const isActive = ToBoolean(status);

        const departments = await findAllUnitPagination(page, limit, sort, search, isActive, departmentId);

        return res.send(departments);
    } catch (e: any) {
        log.error(e)
        return res.send(e.message)
    }

}


export async function updateUnitHandler(req: Request, res: Response) {
    try {
        const id = get(req, "params.id")
        const unit = await findUnit({ _id: id })

        if (!unit) return res.send({ message: "not unit found" })

        const update = await findAndUpdateUnit({ _id: id }, req.body, { new: true })

        return res.send(update)

    } catch (e: any) {
        log.error(e)
        return res.send(e.message)

    }
}

