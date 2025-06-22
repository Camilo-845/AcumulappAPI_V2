import jwt from "jsonwebtoken";
import { environment } from "../config/api/environment"; // Correct import path for environment

const JWT_SECRET = environment.jwtSecret;
const JWT_EXPIRES_IN = Number(environment.jwtExpiresIn) || 3600;

export const signJwt = (payload: object): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en la configuración.");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyJwt = (token: string): string | jwt.JwtPayload => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en la configuración.");
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token de autenticación expirado.");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Token de autenticación inválido.");
    }
    throw new Error("Error al verificar el token.");
  }
};
