import { IBusinessCategory } from "../businessCategories/BusinessCategories.model";
import { IPlan } from "../plan/Plan.model";

export interface IBusiness {
  id: number;
  name?: string | null;
  email?: string | null;
  logoImage?: string | null;
  address?: string | null; // Corregido a 'address' en camelCase si tu DB lo tiene en minúscula
  fullInformation: boolean;

  categories?: IBusinessCategory[] | null;
}

export interface ICreateBusinessData {
  name?: string;
  email?: string;
  idLocation?: number;
  logoImage?: string;
  address?: string;
  idPlan?: number; // Puede ser opcional si tiene un default en la DB
  fullInformation?: boolean; // Puede ser opcional si tiene un default en la DB
}
