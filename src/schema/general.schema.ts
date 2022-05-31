import { object, string, boolean, number } from "yup";

export const query = {
  query: object({
    page: number().required().integer().positive(),
    limit: number().required(),
    sort: boolean(),
    search: string(),
    status: boolean(),
  }),
};
