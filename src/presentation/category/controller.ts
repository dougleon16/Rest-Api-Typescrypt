import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services/category.service";
import { error } from "console";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log("error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  public createCategory = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    const { user } = req.body;

    this.categoryService
      .createCategory(createCategoryDto!, user)
      .then((category) => res.status(201).json(category))
      .catch((error) => this.handleError(error, res));
  };

  public getCategories = async (req: Request, res: Response) => {
    const { limit = 10, page = 1 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) res.status(400).json({ error });

    this.categoryService
      .getCategories(paginationDto!)
      .then((categories) => {
        res.status(200).json(categories);
      })
      .catch((error) => this.handleError(error, res));
  };
}
