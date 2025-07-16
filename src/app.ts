import express, { Application, Request, Response } from "express";
import apiV1Routes from "./api/v1/routes"; // Importamos el enrutador principal v1
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middelwares";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    //Cors config
    this.app.use(cors());
    // Morgan Config
    this.app.use(morgan("dev"));
    // Middlewares esenciales
    this.app.use(express.json({ limit: "50mb" })); // Para parsear JSON bodies
    this.app.use(express.urlencoded({ extended: true })); // Para parsear URL-encoded bodies

    // Middlewares personalizados (ej: logging)
  }

  private routes(): void {
    this.app.get("/", (_req: Request, res: Response) => {
      res.send("¡Hola Mundo desde la App!");
    });

    // Usamos el enrutador de la API v1 con su prefijo
    this.app.use("/api/v1", apiV1Routes);

    // Middleware de manejo de errores (debe ir al final)
    this.app.use(errorHandler);
  }
}

export default new App().app;
