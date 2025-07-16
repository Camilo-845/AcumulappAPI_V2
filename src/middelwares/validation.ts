import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../core";

declare global {
  namespace Express {
    interface Request {
      validatedData?: {
        body?: Record<string, any>; // Tipo genérico para objetos de cuerpo
        query?: Record<string, any>; // Tipo genérico para objetos de consulta
        params?: Record<string, any>; // Tipo genérico para objetos de parámetros
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

      // Asegura que validatedData exista y fusiona los nuevos datos
      req.validatedData = {
        body: { ...req.validatedData?.body, ...parsedData.body },
        query: { ...req.validatedData?.query, ...parsedData.query },
        params: { ...req.validatedData?.params, ...parsedData.params },
      };

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
