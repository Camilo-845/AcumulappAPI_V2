import { ErrorRequestHandler } from "express";
import ApiError from "../core/errors/apiError";
import { environment } from "../config/api";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
    return;
  }
  console.error(err);

  // Para cualquier otro tipo de error, devuelve un 500
  res.status(500).json({
    message: "Internal Server Error",
    ...(environment.nodeEnv === "development" &&
      err instanceof Error && { stack: err.stack }),
  });
};

export default errorHandler;
