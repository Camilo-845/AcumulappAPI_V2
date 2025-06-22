import { IAccount } from "../account/Account.model";
import { IBusiness } from "../business/Business.model"; // Asumiendo que tendrás este módulo y modelo
import { IRole } from "../role/role.model";

export interface ICollaborator {
  idAccount: number;
  idBusiness: number;
  idRol: number;
  account?: IAccount; // Relación opcional
  business?: IBusiness; // Relación opcional
  role?: IRole; // Relación opcional
}

export interface ICreateCollaboratorData {
  idAccount: number;
  idBusiness: number;
  idRol: number;
}
