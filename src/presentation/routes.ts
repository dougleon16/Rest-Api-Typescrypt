import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { CategoryRoutes } from "./category/routes";
import { ProductRoutes } from "./product/product.routes";
import { FileUpload } from "./fileUpload/fileUpload.routes";
import { ImagesRoutes } from "./images/images.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/categories", CategoryRoutes.routes);
    router.use("/api/products", ProductRoutes.routes);

    // * FileUpload Routes
    router.use("/api/upload", FileUpload.routes);

    // * Images
    router.use("/api/image", ImagesRoutes.routes);

    return router;
  }
}
