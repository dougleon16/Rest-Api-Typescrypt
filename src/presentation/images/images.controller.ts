import { Response, Request } from "express";
import { CustomError } from "../../domain";

import fs from "node:fs";
import path from "node:path";

export class ImagesController {
  constructor() {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log("error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  public getImage = (req: Request, res: Response) => {
    const { type = "", img = "" } = req.params;

    const imagePath = path.resolve(
      __dirname,
      `../../../uploads/${type}/${img}`
    );

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.sendFile(imagePath);
  };
}
