import { object, string, number, boolean } from "yup";
import { query } from "./general.schema";

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
  ...query,
});

export const updatedCustomerSchema = object({ ...params, ...payload });

export const changeCustomerStatusSchema = object({
  ...params,
  body: object({
    isActive: boolean().required("Status is required!"),
  }),
});
