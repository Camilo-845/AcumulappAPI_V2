import { AuthResponseDTO } from "../modules/account/DTO/Response";

declare module "express-serve-static-core" {
  interface Request {
    account?:
      | AuthResponseDTO["account"]
      | { id: number; email: string; userType: string }; // Ajusta este tipo para que sea más específico si lo necesitas
  }
}
