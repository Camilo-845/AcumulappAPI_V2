// Define la interfaz para el modelo de dominio de una Tarjeta de Cliente
export interface IClientCard {
  id: number;
  idClient: number;
  idCard: number;
  idCardState: number;
  expirationDate: Date; // TIMESTAMP en SQL, mapea a Date en JS
  currentStamps: number;
  uniqueCode: string | null; // CHAR(8) en SQL, mapea a string o null
}

// Define la interfaz para los datos necesarios para crear una nueva Tarjeta de Cliente
export interface ICreateClientCardData {
  idClient: number;
  idCard: number;
  idCardState: number; // Por lo general, se inicia en un estado predeterminado, pero puede ser explícito.
  expirationDate: Date;
  currentStamps: number; // Por lo general, se inicia en 0
  uniqueCode: string;
}

// Opcional: Interfaz para los datos de actualización
export interface IUpdateClientCardData {
  idClient?: number;
  idCard?: number;
  idCardState?: number;
  expirationDate?: Date;
  currentStamps?: number;
  uniqueCode?: string | null;
}
