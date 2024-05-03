import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";

import { JwtAdapter, bcrypAdapter } from "../../config";

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const email = await UserModel.findOne({ email: registerUserDto.email });

    if (email) throw CustomError.badRequest("Email already registered");

    try {
      const user = new UserModel(registerUserDto);

      // Encriptar la contrasena
      user.password = bcrypAdapter.hash(registerUserDto.password);
      await user.save();

      // JWT <session del usuario

      // Enviar el correo de verificacion

      const { password, ...userEntity } = UserEntity.fromObject(user);
      return { ...userEntity, token: "ABC" };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest("Invalid credentials");

    const isMatchPassword = bcrypAdapter.compare(
      loginUserDto.password,
      user.password
    );

    if (!isMatchPassword) throw CustomError.badRequest("Invalid credentials");

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({
      id: user.id,
    });

    if (!token) throw CustomError.internalServer("Error generating token");
    return { ...userEntity, token };
  }
}
