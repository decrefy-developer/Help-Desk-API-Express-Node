import { object, string, boolean, number } from "yup";
import { query } from "./general.schema";

const payload = {
  body: object({
    name: string().required("Category Name is required!"),
  }),
};

const params = {
  params: object({
    id: string().required("ID is required!"),
  }),
};

export const createCategorySchema = object({ ...payload });

export const updateCategorySchema = object({ ...payload });

export const changeCategoryStatusSchema = object({
  ...params,
  body: object({
    isActive: boolean().required("Status is required"),
  }),
});

export const readCategorySchema = object({
  ...query,
});

export const readOneCategorySchema = object({
  ...params,
});
