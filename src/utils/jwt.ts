import jwt from "jsonwebtoken";
import { environment } from "../config/api/environment"; // Correct import path for environment
import { JwtPayload } from "../types";

const JWT_SECRET = environment.jwtSecret;
const JWT_EXPIRES_IN = Number(environment.jwtExpiresIn) || 3600;

export const signJwt = (payload: JwtPayload): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en la configuración.");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyJwt = (token: string): JwtPayload => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en la configuración.");
  }
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw error;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw error;
    }
    throw new Error("Error al verificar el token.");
  }
};
