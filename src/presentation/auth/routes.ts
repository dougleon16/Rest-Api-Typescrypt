import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService, EmailService } from "../services";
import { envs } from "../../config";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    // * Controllers
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.EMAIL_SENT
    );
    const authService = new AuthService(emailService);
    const authController = new AuthController(authService);

    // * Routes
    router.post("/login", authController.loginUser);
    router.post("/register", authController.registerUser);

    router.get("/validate-email/:token", authController.validateEmail);

    return router;
  }
}
