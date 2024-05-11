import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";

import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const email = await UserModel.findOne({ email: registerUserDto.email });

    if (email) throw CustomError.badRequest("Email already registered");

    try {
      const user = new UserModel(registerUserDto);

      // Encriptar la contrasena
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();

      // JWT <session del usuario

      const token = await JwtAdapter.generateToken({
        id: user.id,
        email: user.email,
      });

      if (!token) throw CustomError.internalServer("Error generating token");

      // Enviar el correo de verificacion
      this.sendEmailValidationLink(registerUserDto.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);
      return { ...userEntity, token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest("Invalid credentials");

    const isMatchPassword = bcryptAdapter.compare(
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

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({
      email,
    });

    if (!token) throw CustomError.internalServer("Error generating token");

    const link = `${envs.WEB_SERVICE}/auth/validate-email/${token}`;

    const html = `
      <h1>Validate your email</h1>
      <p>Click the link below to validate your email</p>
      <a href="${link}">Validate email</a>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };
    const isSent = await this.emailService.sendEmail(options);

    if (!isSent) throw CustomError.internalServer("Error sending email");

    return {
      message: "Email sent",
    };
  };

  public async validateEmail(token: string) {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid Token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("email Not in token");

    const user = await UserModel.findOne({ email: email });

    if (!user) throw CustomError.internalServer("this user not Exist");

    user.emailValidated = true;
    await user.save();

    return true;
  }
}
