import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";
import { CreateProductDto } from "../../domain";
import { ProductService } from "../services";

export class ProductController {
  constructor(
    private productService: ProductService
  ) {} // * todo: private readonly productService:ProductService

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
  }

  getProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.productService.getProducts(paginationDto!)
    .then((products)=> res.status(200).json(products))
    .catch((error)=>  this.handleError(error, res))

  };
  createProduct =  (req: Request, res: Response) => {
    const [error, createProductdto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id,
    });
    if (error) return res.status(400).json({ error });

    this.productService.createProduct(createProductdto!)
    .then((product)=> res.status(201).json(product))
    .catch((error)=>  this.handleError(error, res))
    
  };
}
