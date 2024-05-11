import { Router } from "express";
import { ProductController } from "./product.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ProductService } from "../services";

export class ProductRoutes {
  public static get routes(): Router {
    const router = Router();
    // * Services
    const productService = new ProductService()
    // * Controllers
    const productController = new ProductController(productService);
    // * Routes

    router.get("/", productController.getProducts);
    router.post(
      "/",
      [AuthMiddleware.validateJWT],
      productController.createProduct
    );

    return router;
  }
}
