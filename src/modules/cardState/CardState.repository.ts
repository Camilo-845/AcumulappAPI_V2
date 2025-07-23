import prisma from "../../config/db/prismaClient";
import { ICardState } from "./CardState.model";

export class CardStateRepository {
  async findAll(): Promise<ICardState[]> {
    return await prisma.cardStates.findMany();
  }
}
