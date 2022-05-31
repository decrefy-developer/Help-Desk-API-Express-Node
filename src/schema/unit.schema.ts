import { boolean, object, string, number } from "yup";
import { query } from "./general.schema";


const payload = {
    body: object({
        departmentId: string().required("Department is required"),
        name: string().required("Unit name is required"),
    })
}

const params = {
    params: object({
        id: string().required()
    })
}

export const createUnitSchame = object({
    ...payload
})

export const readUnitSchema = object({
    ...params
})

export const readAllUnitSchema = object({
    query: object({
        page: number().required().integer().positive(),
        limit: number().required(),
        sort: boolean(),
        search: string(),
        status: boolean(),
        departmentId: string()
    }),
})

export const updateUnitNameSchema = object({
    ...params,
    body: object({
        name: string().required("Unit name is required"),
    })
})

export const changeUnitStatusSchema = object({
    ...params,
    body: object({
        isActive: boolean().required("Status is required")
    })
})