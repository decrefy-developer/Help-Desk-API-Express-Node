import { object, string, boolean, number } from "yup";
import { query } from "./general.schema";

const payload = {
    body: object({
        userId: string().required("user is  required"),
        concern: string().required("Concern is required")
    }),
};

const params = {
    params: object({
        id: string().required("ID is required!"),
    }),
};


export const createRequestSchema = object({ ...payload })

export const readRequestSchema = object({
    query: object({
        page: number().required().integer().positive(),
        limit: number().required(),
        status: boolean().required(),
        sort: boolean(),
        search: string(),
        userId: string()
    }),
})

export const updateRequestSchema = object({
    ...params,
    body: object({ status: boolean().required() })
})