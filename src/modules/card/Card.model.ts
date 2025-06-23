import { IBusiness } from "../business/Business.model";

export interface ICard {
  id: number;
  idBusiness: number;
  expiration: number;
  maxStamp: number;
  description: string;
  business?: IBusiness;
}

// Define la interfaz para los datos necesarios para crear una nueva Tarjeta
// Aquí no se incluye 'id' porque lo genera la base de datos
export interface ICreateCardData {
  idBusiness: number;
  expiration: number;
  maxStamp: number;
  description: string;
}

// Opcional: Interfaz para los datos de actualización (todas las propiedades opcionales)
export interface IUpdateCardData {
  idBusiness?: number;
  expiration?: number;
  maxStamp?: number;
  description?: string;
}
