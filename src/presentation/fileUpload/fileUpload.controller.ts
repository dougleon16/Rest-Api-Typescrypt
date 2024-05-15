import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services";
import { UploadedFile } from "express-fileupload";

export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log("error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  public uploadFile = (req: Request, res: Response) => {
    const type = req.params.type;

    const file = req.body.files.at(0) as UploadedFile;
    console.log(file);
    this.fileUploadService
      .uploadSingle(file, `uploads/${type}`)
      .then((uploaded) => {
        res.json(uploaded);
      })
      .catch((error) => this.handleError(error, res));
  };

  public uploadMultipleFile = (req: Request, res: Response) => {
    const type = req.params.type;

    const files = req.body.files as UploadedFile[];
    this.fileUploadService
      .uploadMultiple(files, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.handleError(error, res));
  };
}
