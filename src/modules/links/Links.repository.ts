import prisma from "../../config/db/prismaClient";
import { ILink } from "./Links.model";

export class LinksRepository {
  async findAll(): Promise<ILink[]> {
    return await prisma.links.findMany();
  }
}
