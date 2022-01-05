import { Request, Response, Express } from "express";
import log from "../logger";
import { findFile, findFiles, uploadFiles } from "../service/file.service";
import { get } from "lodash";
import path from "path";

export async function uploadFilesHandler(req: Request, res: Response) {
  try {
    const file = req.file;

    if (file) {
      const body: string = file.filename;
      const category = get(req.body, "category");

      const isExisted = await findFile({ category });

      if (isExisted) return res.send({ message: "File is already exist!" });

      const upload = await uploadFiles({ filename: body, category });

      if (upload)
        return res.send({ message: "File has been succesfully saved!" });
    }
  } catch (error: any) {
    log.error(error);
    return res.status(409).send(error.message);
  }
}

// export async function getFilesHandler(req: Request, res: Response) {
//   const param = get(req.params, "category");
//   const dirname = path.resolve();

//   const file = await findFile({category:})
//   const files = await findFiles();

//   //* filter the files using category(membership,loan,withdrawal) to get the filename
//   const file = files.filter((file) => file.category === param.toUpperCase());

//   if (Object.keys(file).length <= 0) return res.send(null);
//   //* get the file from folder directory
//   const pdfFile = dirname + `/public/uploads/${file[0].filename}`;

//   return res.sendFile(pdfFile);
// }

export async function getFilesHandler(req: Request, res: Response) {
  const files = await findFiles();

  if (Object.keys(files).length <= 0)
    return res.send({ message: "no files found!" });

  return res.send(files);
}

export async function getPDFHandler(req: Request, res: Response) {
  const dirname = path.resolve();
  const category = get(req.params, "category");

  const isExisted = await findFile({ category });

  if (!isExisted) return res.send({ message: "No files Found!" });

  const pdfFile = dirname + `/public/uploads/${isExisted.filename}`;

  return res.sendFile(pdfFile);
}
