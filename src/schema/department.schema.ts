import { object, string, array, boolean, number } from "yup";
import { query } from "./general.schema";


const payload = {
    body: object({
        name: string().required("Department name is required"),
        isActive: boolean(),
    })
}

const params = {
    params: object({
        id: string().required()
    })
}

export const createDepartmentSchema = object({
    ...payload
})

export const readDepartmentSchema = object({
    ...params
})

export const readAllDepartmentsSchema = object({
    ...query
})

export const updateDepartmentNameSchema = object({
    ...params,
    body: object({
        name: string().required("Department name is required")
    })
})

export const changeStatusSchema = object({
    ...params,
    body: object({
        isActive: boolean().required("Status is required")
    })
})
