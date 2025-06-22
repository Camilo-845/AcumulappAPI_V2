import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../core";

declare global {
  namespace Express {
    interface Request {
      validatedData?: {
        body?: any; // Puedes tipar esto de forma más específica si lo deseas
        query?: any; // Ej: query?: YourSpecificQueryDTO;
        params?: any; // Ej: params?: YourSpecificParamsDTO;
      };
    }
  }
}

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.validatedData = {};
      if (parsedData.body) {
        req.validatedData.body = parsedData.body;
      }
      if (parsedData.query) {
        req.validatedData.query = parsedData.query;
      }
      if (parsedData.params) {
        req.validatedData.params = parsedData.params;
      }
      next(); // Si la validación es exitosa, pasa al siguiente middleware/controlador
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        next(
          new ApiError(StatusCodes.BAD_REQUEST, "Error de validación", errors),
        );
      } else {
        next(error);
      }
    }
  };

export default validate;
