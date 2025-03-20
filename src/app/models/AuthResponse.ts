export interface AuthResponse {
  success: boolean;
  errorMessage: string;
  debugMessage: string;
  data: {
    token: string;
    refreshToken: string;
    createdDate: string;
    expirationDate: string;
    refreshTokenExpirationDate: string;
  };
}
