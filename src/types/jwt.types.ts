export interface JwtPayload {
  id: number;
  email: string;
  userType: string;
  collaboratorDetails?: {
    businessId: number;
    role: string;
  }[];
  exp?: number;
}
