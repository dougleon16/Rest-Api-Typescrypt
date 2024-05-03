import { CustomError } from "../index";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: string[],
    public img?: string
  ) {}

  static fromObject(object: { [key: string]: any }): UserEntity {
    const { id, _id, name, email, emailValidated, password, role, img } =
      object;

    if (!id && !_id) throw CustomError.badRequest("Missing ID");

    if (!name) throw CustomError.badRequest("Missing name");

    if (!email) throw CustomError.badRequest("Missing email");

    if (!password) throw CustomError.badRequest("Missing password");

    if (!role) throw CustomError.badRequest("Missing role");

    if (emailValidated === undefined)
      throw CustomError.badRequest("Missing emailValidated");

    return new UserEntity(
      _id || id,
      name,
      email,
      emailValidated,
      password,
      role,
      img
    );
  }
}
