export interface ClientAccountDetailsResponseDTO {
  id: number;
  email: string;
  fullName: string;
  profileImageURL: string;
  userType: "client";
}

export interface CollaboratorAccountDetailsResponseDTO {
  id: number;
  email: string;
  fullName: string;
  userType: "collaborator";
  profileImageURL: string;
  collaboratorDetails: Array<{
    businessId: number;
    businessName: string;
    role: string;
  }>;
}

export type AccountDetailsResponseDTO =
  | ClientAccountDetailsResponseDTO
  | CollaboratorAccountDetailsResponseDTO;

