import { Router } from "express";
import { FileUploadController } from "./fileUpload.controller";
import { FileUploadService } from "../services";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";

export class FileUpload {
  public static get routes(): Router {
    const router = Router();
    // * Services
    const fileUploadService = new FileUploadService();
    // * Controllers
    const fileUploadController = new FileUploadController(fileUploadService);

    router.use(FileUploadMiddleware.containFiles)
    router.use(TypeMiddleware.validTypes(["users", "categories", "products"]))
    // * Routes
    router.post("/single/:type", fileUploadController.uploadFile);
    router.post("/multiple/:type", fileUploadController.uploadMultipleFile);

    return router;
  }
}
