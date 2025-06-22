import { Request, Response } from "express";
import { ApiError, asyncHandler } from "../core";
import { StatusCodes } from "http-status-codes";
import { verifyJwt } from "../utils";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const authenticateToken = asyncHandler(
  async (req: Request, _res: Response, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Token no proporcionado o formato incorrecto.",
      );
    }

    const token = authHeader.split(" ")[1]; // Extrae el token de "Bearer <token>"

    try {
      const decoded = verifyJwt(token);
      req.user = { id: decoded.id, email: decoded.email };
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Token expirado.");
      }
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token inválido.");
    }
  },
);
