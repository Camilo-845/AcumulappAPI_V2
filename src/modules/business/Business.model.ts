// deberías importarlas aquí y añadirlas a la interfaz IBusiness.

import { ILocation } from "../location/Location.model";
import { IPlan } from "../plan/Plan.model";

export interface IBusiness {
  id: number;
  name?: string | null;
  email?: string | null;
  idLocation?: number | null; // ID de la ubicación asociada
  logoImage?: string | null;
  address?: string | null; // Corregido a 'address' en camelCase si tu DB lo tiene en minúscula
  idPlan: number; // ID del plan asociado
  fullInformation: boolean;

  // Relaciones (opcionales para el modelo de dominio si no siempre se cargan)
  location?: ILocation | null; // Objeto de la ubicación asociada
  plan?: IPlan | null; // Objeto del plan asociado
}

export interface ICreateBusinessData {
  name: string;
  email: string;
  idLocation?: number;
  logoImage?: string;
  address?: string;
  idPlan?: number; // Puede ser opcional si tiene un default en la DB
  fullInformation?: boolean; // Puede ser opcional si tiene un default en la DB
}
