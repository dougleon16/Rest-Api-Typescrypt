import { UploadedFile } from "express-fileupload";
import fs from "node:fs";
import path from "node:path";
import { Uuid } from "../../config/uuid.adapter";
import { CustomError } from "../../domain";

export class FileUploadService {
  constructor(
    private readonly uuid = Uuid.v4()
  ) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }
  public async uploadSingle(
    file: UploadedFile,
    folder: string = "uploads",
    validExtensions: string[] = ["png",  "jpg",  "jpeg",  "gif"]
  ) {
    try {
      const fileExtension = file.mimetype.split("/").at(1) ?? ""
  
      if(!validExtensions.includes(fileExtension)){
        throw CustomError.badRequest(`Invalid Extension: ${fileExtension}, valid ones: ${validExtensions}`)
      } 
      const destination = path.resolve(__dirname, "../../../", folder);
      this.checkFolder(destination);
      const fileName = `${this.uuid}.${fileExtension}`;
      file.mv(`${destination}/${fileName}`);
      return fileName;
    } catch (error) {
      throw error
    }
  }
  public async uploadMultiple(
    files: UploadedFile[],
    folder: string = "uploads",
    validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
  ) {
    const filesNames = await Promise.all(
      files.map(file => this.uploadSingle(file, folder, validExtensions))
    )

    return filesNames
  }
}
