export interface ClientAuthResponseDTO {
  token: string;
  refreshToken: string;
  account: {
    id: number;
    email: string;
    fullName: string;
    userType: "client";
  };
}

export interface CollaboratorAuthResponseDTO {
  token: string;
  refreshToken: string;
  account: {
    id: number;
    email: string;
    fullName: string;
    userType: "collaborator";
    collaboratorDetails: Array<{
      businessId: number;
      businessName: string;
      role: string; // Nombre del rol (Owner, Admin, Employee)
    }>;
  };
}

// Un tipo union para la respuesta de login
export type AuthResponseDTO =
  | ClientAuthResponseDTO
  | CollaboratorAuthResponseDTO;
