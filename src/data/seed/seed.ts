import { envs } from "../../config"
import { MongoDatabase } from "../mongo/init"
import { CategoryModel } from "../mongo/models/category.model"
import { ProductModel } from "../mongo/models/product.model"
import { UserModel } from "../mongo/models/user.model"
import { seedData } from "./data"

(async()=>{
    MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME
    })
   await main()

   await MongoDatabase.disconnect()
})()


const randomBetween0andX = (x: number)=>{
    return Math.floor(Math.random()*x)
}

async function main(){
    // borrar todo
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany()


    ])

    // 1 crear usuarios

    const user = await UserModel.insertMany(seedData.users)
    const categories = await CategoryModel.insertMany(
    seedData.categories.map((category)=>{
        return {...category,user:user[randomBetween0andX(seedData.users.length - 1)]._id}
    })

    )
    const products = await ProductModel.insertMany(
        seedData.products.map((product)=>{
            return {...product,
                user: user[randomBetween0andX(seedData.users.length - 1)]._id,
                category: categories[randomBetween0andX(seedData.categories.length - 1)]._id
            }
               
        })
    )


}