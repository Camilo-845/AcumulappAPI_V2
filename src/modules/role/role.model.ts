// src/modules/role/Role.model.ts

export interface IRole {
  id: number;
  name: string; // Nombre del rol (Owner, Admin, Employee)
}

export interface ICreateRoleData {
  name: string;
}
