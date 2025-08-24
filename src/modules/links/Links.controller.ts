import { Request, Response } from "express";
import { asyncHandler } from "../../core";
import { LinksService } from "./Links.service";
import { StatusCodes } from "http-status-codes";

const linksService = new LinksService();

export const getAllLinks = asyncHandler(async (req: Request, res: Response) => {
  const links = await linksService.getAllLinks();
  return res.status(StatusCodes.OK).json(links);
});
