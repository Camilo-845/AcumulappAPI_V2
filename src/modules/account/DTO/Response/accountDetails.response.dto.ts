export interface AccountDetailsResponseDTO {
  id: number;
  email: string;
  fullName: string;
  isActive: boolean;
  emailVerified: boolean;
  profileImageURL: string | null;
}
