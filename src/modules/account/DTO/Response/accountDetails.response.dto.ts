export interface ClientAccountDetailsResponseDTO {
  id: number;
  email: string;
  fullName: string;
  userType: "client";
}

export interface CollaboratorAccountDetailsResponseDTO {
  id: number;
  email: string;
  fullName: string;
  userType: "collaborator";
  collaboratorDetails: Array<{
    businessId: number;
    businessName: string;
    role: string;
  }>;
}

export type AccountDetailsResponseDTO =
  | ClientAccountDetailsResponseDTO
  | CollaboratorAccountDetailsResponseDTO;