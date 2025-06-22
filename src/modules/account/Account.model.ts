export interface IAccount {
  id: number;
  email: string;
  fullName: string;
  isActive: boolean;
  emailVerified: boolean;
  profileImageURL?: string | null;
  idAuthProvider: number;
  providerUserId?: string | null;
}

/**
 * Interfaz para la creación de una cuenta desde la perspectiva del dominio/servicio.
 * Incluye la contraseña sin hashear antes de ser procesada por el servicio.
 */
export interface ICreateAccountData {
  email: string;
  password?: string;
  fullName: string;
  idAuthProvider: number;
  providerUserId?: string | null;
}

/**
 * Interfaz para datos de login interno (lo que el servicio procesa).
 */
export interface ILoginAccountData {
  email: string;
  password: string;
}
