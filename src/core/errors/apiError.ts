interface ErrorDetail {
  path: string; // El campo que causó el error (ej: 'body.email')
  message: string; // El mensaje de error específico para ese campo
}

class ApiError extends Error {
  public statusCode: number;
  public details?: ErrorDetail[];

  constructor(statusCode: number, message: string, details?: ErrorDetail[]) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    this.details = details;
    // Mantener el stack trace adecuado
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export default ApiError;
