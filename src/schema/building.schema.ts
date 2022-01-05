import { object, string } from "yup";

const payload = {
  body: object({
    building: string().required("building is required"),
  }),
};

const params = {
  params: object({
    buildingId: string().required("buildingId is required"),
  }),
};

export const createBuildingSchema = object({
  ...payload,
});

export const getAllBuildingSchema = object({
  ...payload,
});

export const getBuildingSchema = object({
  ...payload,
});

export const updateBuildingSchema = object({
  ...params,
  ...payload,
});

export const deleteBuildingSchema = object({
  ...params,
});
