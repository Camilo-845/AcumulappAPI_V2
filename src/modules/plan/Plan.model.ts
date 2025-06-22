export interface IPlan {
  id: number;
  name: string; // Por ejemplo: 'Gratuito', 'Premium'
}

export interface ICreatePlanData {
  name: string;
}

// Opcional: Interfaz para actualizar un plan
export interface IUpdatePlanData {
  name?: string;
}
