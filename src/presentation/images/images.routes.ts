import { Router } from "express";
import { ImagesController } from "./images.controller";

export class ImagesRoutes {
  public static get routes(): Router {
    const router = Router();

    // * Controllers
    const imageController = new ImagesController();

    router.get("/:type/:img", imageController.getImage);
    return router;
  }
}
