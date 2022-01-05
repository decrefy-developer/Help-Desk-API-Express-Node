import { object, string } from "yup";

const payload = {
  body: object({
    farm: string().required("Farm is required"),
  }),
};

const params = {
  params: object({
    farmId: string().required("FarmId is required"),
  }),
};

export const createFarmSchema = object({
  ...payload,
});

export const updateFarmSchema = object({
  ...params,
  ...payload,
});

export const deleteFarmSchema = object({
  ...params,
});
