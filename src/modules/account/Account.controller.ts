// src/api/v1/controllers/auth.controller.ts

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AccountService } from "./Account.service";
import { asyncHandler } from "../../core";
import { getDetailsByIdDTO, LoginRequestDTO } from "./DTO/Request";
import { LocalRegisterRequestDTO } from "./DTO/Request/localRegister.request.dto";
import { getDetailsByEmailDTO } from "./DTO/Request/account.request.dto";

const accountService = new AccountService();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const loginData: LoginRequestDTO = req.body; // Los datos ya validados por el middleware de validación
  const authResponse = await accountService.login(loginData);
  return res.status(StatusCodes.OK).json(authResponse);
});

export const clientRegister = asyncHandler(
  async (req: Request, res: Response) => {
    const registerData: LocalRegisterRequestDTO = req.body;
    const authResponse = await accountService.registerClient(registerData);
    return res.status(StatusCodes.OK).json(authResponse);
  },
);

export const businessRegister = asyncHandler(
  async (req: Request, res: Response) => {
    const registerData: LocalRegisterRequestDTO = req.body;
    const authResponse = await accountService.registerBusiness(registerData);
    return res.status(StatusCodes.OK).json(authResponse);
  },
);

export const getAccountDetailsById = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.validatedData!.params as getDetailsByIdDTO;
    const accountDetails = await accountService.getAccountById(data);
    return res.status(StatusCodes.OK).json(accountDetails);
  },
);

export const getAccountDetailsByEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.validatedData!.params as getDetailsByEmailDTO;
    const accountDetails = await accountService.getAccountByEmail(data);
    return res.status(StatusCodes.OK).json(accountDetails);
  },
);
