// src/api/v1/controllers/auth.controller.ts

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AccountService } from "./Account.service";
import { ApiError, asyncHandler } from "../../core";
import {
  getDetailsByIdDTO,
  LoginRequestDTO,
  getDetailsByEmailDTO,
  LoginQueryDTO,
} from "./DTO/Request";
import { LocalRegisterRequestDTO } from "./DTO/Request/localRegister.request.dto";
import {
  UpdateAccountRequestDTO,
  UpdateAccountRequestParamsDTO,
} from "./DTO/Request/updateAccount.request.dto";

const accountService = new AccountService();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const loginData: LoginRequestDTO = req.body; // Los datos ya validados por el middleware de validación
  const { userType } = req.validatedData!.query as LoginQueryDTO;
  const authResponse = await accountService.login(loginData, userType);
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
    if (!req.user || !req.user.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
    const clientId = req.user.id as number;

    const accountDetails = await accountService.getAccountById({
      id: clientId,
    });
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

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const newTokens = await accountService.refreshToken(refreshToken);
    res.status(StatusCodes.OK).json(newTokens);
  },
);

export const clerkSignIn = asyncHandler(async (req: Request, res: Response) => {
  const { userId, sessionClaims } = req.auth;
  const authResponse = await accountService.clerkSignIn(
    userId as string,
    sessionClaims,
  );
  return res.status(StatusCodes.OK).json(authResponse);
});

export const updateAccount = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
    const clientId = req.user.id as number;
    const updateData: UpdateAccountRequestDTO = req.body;

    const updatedAccount = await accountService.updateAccount(
      clientId,
      updateData,
    );

    return res.status(StatusCodes.OK).json(updatedAccount);
  },
);
