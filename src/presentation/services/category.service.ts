import { CustomError } from "./../../domain/errors/custom.error";
import { CreateCategoryDto, PaginationDto, UserEntity } from "../../domain";
import { CategoryModel } from "../../data";

export class CategoryService {
  constructor() {}

  public async createCategory(
    createCategoryDto: CreateCategoryDto,
    user: UserEntity
  ) {
    const categoryExists = await CategoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (categoryExists) throw CustomError.badRequest("Catagory Already Exist");

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });
      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const skip = (page - 1) * limit;
    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find().skip(skip).limit(limit),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `api/categories?page=${page + 1}&limit=${limit}`,
        previous:
          page - 1 > 0
            ? `api/categories?page=${page - 1}&limit=${limit}`
            : null,

        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
