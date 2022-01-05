import { object, string, number, boolean } from "yup";

const payload = {
  body: object({
    name: string().required("Customer name is required"),
  }),
};

const params = {
  params: object({
    id: string().required("ID is required!"),
  }),
};

export const createCustomerSchema = object({ ...payload });

export const readCustomerSchema = object({
  query: object({
    page: number().required().integer().positive(),
    limit: number().required(),
    sort: boolean(),
    search: string(),
  }),
});

export const updatedCustomerSchema = object({ ...params, ...payload });

export const changeCustomerStatusSchema = object({
  ...params,
  body: object({
    isActive: boolean().required("Status is required!"),
  }),
});
