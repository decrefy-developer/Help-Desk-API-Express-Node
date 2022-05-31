import { Response, Request } from "express";
import { get } from "lodash";
import log from "../logger";
import { createDepartment, findAllDepartment, findAndUpdate, findDepartment } from "../service/department.service";
import { ToBoolean } from "../utils/toBoolean";


export async function createDepartmentHandler(req: Request, res: Response) {
    try {

        const newDepartment = await createDepartment(req.body)

        return res.send(newDepartment)
    } catch (e: any) {
        log.error(e)
        return res.send(e.message)
    }
}

export async function readDepartmentHandler(req: Request, res: Response) {
    try {
        const id = get(req, "params.id")

        const department = await findDepartment({ _id: id })

        return res.send(department)

    } catch (e: any) {
        log.error(e)
        return res.send(e.message)
    }
}

export async function readAllDepartmentsHandler(req: Request, res: Response) {
    try {
        let page = get(req, "query.page") as number;
        const limit = get(req, "query.limit") as number;
        const sort = get(req, "query.sort") as boolean;
        const search = get(req, "query.search") as string;
        const status = get(req, "query.status");

        if (search !== "") page = 1; // turns back the page into 1

        const isActive = ToBoolean(status);

        const departments = await findAllDepartment(page, limit, sort, search, isActive);

        return res.send(departments);

    } catch (e: any) {
        log.error(e)
        return res.send(e.message)
    }

}

export async function updateDepartmetNameHandler(req: Request, res: Response) {
    try {
        const id = get(req, "params.id")
        const update = await findAndUpdate({ _id: id }, req.body, { new: true })

        return res.send(update)
    } catch (e: any) {
        log.error(e)
        return res.send(e.message)

    }
}

// export async function manageUnitsHandler(req: Request, res: Response) {
//     try {
//         const id = get(req, "params.id");
//         const mode = get(req, "body.mode"); // is used to know if add/remove
//         const data = get(req, "body.data");


//         const isDepartmentExist = await findDepartment({ _id: id })
//         if (!isDepartmentExist) {
//             return res.status(404).send({ message: "no department found!" })
//         }

//         if (mode === "ADD") {
//             const isUnitExist = isDepartmentExist.units.some(unit => unit.name === data.name)

//             if (isUnitExist) {
//                 return res.status(409).send({ message: `${data.name} is already exist` })
//             }

//             const newUnit = await findAndUpdate({ _id: id }, { $push: { units: data } }, { new: true })

//             return res.send(newUnit)
//         } else {
//             const withRemovedUnit = await findAndUpdate({ _id: id }, { $pull: { units: { _id: data._id } } }, { new: true })

//             return res.send(withRemovedUnit)

//         }
//     } catch (e: any) {
//         log.error(e)
//         return res.send(e.message)
//     }
// }
