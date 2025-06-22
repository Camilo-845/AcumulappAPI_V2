// src/api/v1/controllers/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AccountService } from "./Account.service";
import { asyncHandler } from "../../core";
import { LoginRequestDTO } from "./DTO/Request";

const accountService = new AccountService();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const loginData: LoginRequestDTO = req.body; // Los datos ya validados por el middleware de validación

  const authResponse = await accountService.login(loginData);

  return res.status(StatusCodes.OK).json(authResponse);
});
