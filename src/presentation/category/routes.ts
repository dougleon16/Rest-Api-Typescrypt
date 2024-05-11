import { Router } from "express";
import { CategoryController } from "./controller";
import { CategoryService } from "../services/category.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();

    const categoryService = new CategoryService();

    // * Controllers
    const categoryController = new CategoryController(categoryService);

    router.get("/", categoryController.getCategories);
    router.post(
      "/",
      [AuthMiddleware.validateJWT],
      categoryController.createCategory
    );

    return router;
  }
}
