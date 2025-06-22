import { IAccount } from "../account/Account.model"; // Importa la interfaz de Account

export interface IClient {
  idAccount: number; // El ID de la cuenta asociada
  account?: IAccount; // Relación opcional para cargar los detalles de la cuenta
}

export interface ICreateClientData {
  idAccount: number;
}
