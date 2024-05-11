import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";

export class ProductService {
    constructor(){}

    public async createProduct(createProductDto: CreateProductDto){
        const productExist = await ProductModel.findOne({name:createProductDto.name})
        if(productExist) throw CustomError.badRequest("Product Already Exist")

        try {

            const product = new ProductModel({
                ...createProductDto
            })
            await product.save()

            return product
            
        } catch (error) {
        console.log(error);
        throw CustomError.internalServer("Internal server Error")            
        }
    }

    public async getProducts(paginationDto: PaginationDto){
        const{page, limit} = paginationDto

        const skip = (page - 1) * limit

        try {
            const [totalPage, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find().skip(skip).limit(limit)
                .populate("user")
                .populate("category")
               
            ])

            return {
                page: page,
                limit: limit,
                total: totalPage,
                next: `api/products?page=${page + 1}&limit=${limit}`,
                previous: page - 1 > 0 ? `api/products?page=${page - 1}&limit=${limit}` : null,
                products:products


                }

            
        

            
        } catch (error) {
            console.log(error);
            throw CustomError.internalServer("Internal server Error")
            
        }

    }
}