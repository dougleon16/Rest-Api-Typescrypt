import { Validators } from "../../../config";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly user: string, //user id
    public readonly category: string
  ) {}

  public static create(object: {
    [key: string]: any;
  }): [string?, CreateProductDto?] {
    const { name, available, price, user, category } = object;
    if (!name) return ["name is missing"];
    if (!user) return ["user is missing"];
    if (!category) return ["category is missing"];
    if(!Validators.isMongoID(user)) return ["Invalid user id"]
    if(!Validators.isMongoID(category)) return ["Invalid category id"]
    return [
      undefined,
      new CreateProductDto(name, !!available, price, user, category),
    ];
  }
}
