import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import {
  createCustomer,
  findAllCustomer,
  findAndUpdate,
  findCustomer,
} from "../service/customer.service";

export async function createCustomerHandler(req: Request, res: Response) {
  try {
    const customerName = get(req.body, "name");

    const customer = await findCustomer({ name: customerName });

    if (customer)
      return res.send({
        message: "Customer Name is already exist try another one!",
      });

    const inserted = await createCustomer(req.body);

    return res.send(inserted);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function readAllCustomerHandler(req: Request, res: Response) {
  try {
    const page = get(req, "query.page") as number;
    const limit = get(req, "query.limit") as number;
    const sort = get(req, "query.sort") as boolean;
    const search = get(req, "query.search") as string;

    const customers = await findAllCustomer(page, limit, sort, search);

    return res.send(customers);
  } catch (e: any) {
    return res.send(e.message);
  }
}

export async function readCustomerHandler(req: Request, res: Response) {
  try {
    const customerId = get(req, "params.id");
    const customer = await findCustomer({ _id: customerId });

    if (!customer) return res.send({ message: "No customer found!" });

    return res.send(customer);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function updateCustomerHandler(req: Request, res: Response) {
  try {
    const customerId = get(req, "params.id");
    const updated = await findAndUpdate({ _id: customerId }, req.body, {
      new: true,
    });

    if (!updated) return false;

    return res.send(updated);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}

export async function changeCustomerStatusHandler(req: Request, res: Response) {
  try {
    const customerId = get(req, "params.id");

    const updated = await findAndUpdate({ _id: customerId }, req.body, {
      new: true,
    });

    if (!updated) return false;

    return res.send(updated);
  } catch (e: any) {
    log.error(e);
    return res.send(e.message);
  }
}
