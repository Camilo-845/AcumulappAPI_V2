import { ILocationType } from "../locationType/lacationType.model";

export interface ILocation {
  id: number;
  idFather?: number | null; // ID de la ubicación padre (para jerarquía)
  idLocationType: number; // ID del tipo de ubicación (País, Departamento, Ciudad)
  name: string; // Nombre de la ubicación

  // Relaciones (opcionales en el dominio)
  father?: ILocation | null; // La ubicación padre (relación recursiva)
  locationType?: ILocationType; // El tipo de ubicación
  children?: ILocation[]; // Ubicaciones hijas (ej. ciudades de un departamento)
}

export interface ICreateLocationData {
  idFather?: number | null;
  idLocationType: number;
  name: string;
}

// Opcional: Interfaz para actualizar una ubicación
export interface IUpdateLocationData extends Partial<ICreateLocationData> {}
