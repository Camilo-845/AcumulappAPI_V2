import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../core";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
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
