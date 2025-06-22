import prisma from "../../config/db/prismaClient";
import { ICollaborator, ICreateCollaboratorData } from "./Collaborator.model";

import Prisma from "@prisma/client";

export class CollaboratorRepository {
  async findByAccountIdWithBusinessAndRole(idAccount: number): Promise<
    (Prisma.Collaborators & {
      // Start with the base Collaborator type
      Business: { name: string | null }; // PascalCase 'Business'
      Roles: { name: string }; // PascalCase 'Roles' to match Prisma's output
    })[]
  > {
    return prisma.collaborators.findMany({
      where: { idAccount },
      include: {
        Business: { select: { name: true } },
        Roles: { select: { name: true } }, // Make absolutely sure this is 'Roles', matching your schema
      },
    });
  }

  async create(data: ICreateCollaboratorData): Promise<ICollaborator> {
    const newCollaborator = await prisma.collaborators.create({
      data: {
        idAccount: data.idAccount,
        idBusiness: data.idBusiness,
        idRol: data.idRol,
      },
    });
    return newCollaborator as ICollaborator; // Or, ideally, map to ICollaborator
  }
}
