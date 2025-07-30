import { Request, Response, NextFunction } from "express";
import { ApiError } from "../core";
import { StatusCodes } from "http-status-codes";
import { verifyJwt } from "../utils";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Token no proporcionado."));
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyJwt(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        userType: decoded.userType,
        collaboratorDetails: decoded.collaboratorDetails,
      };
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, "Token expirado."));
      }
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Token inválido."));
    }
  };
