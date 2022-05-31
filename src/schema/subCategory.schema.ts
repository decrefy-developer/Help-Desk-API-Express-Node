import { object, string, boolean, number } from "yup";
import { query } from "./general.schema";

const payload = {
    body: object({
        categoryId: string().required("Category is required"),
        name: string().required("Sub-category name is required"),
        isActive: boolean(),
    })
}

const params = {
    params: object({
        id: string().required('ID is required')
    })
}

export const createSubCategorySchema = object({
    ...payload
})

export const updateSubCategory = object({
    ...params,
    body: object({
        name: string().required("Sub-category name is required"),
    })
});

export const changeSubStatusSchema = object({
    ...params,
    body: object({
        isActive: boolean().required("Status is required"),
    }),
});

export const readSubCategorySchema = object({
    query: object({
        page: number().required().integer().positive(),
        limit: number().required(),
        sort: boolean(),
        search: string(),
        status: boolean(),
        categoryId: string()
    }),
});

export const readOneSubSchema = object({
    ...params,
});
