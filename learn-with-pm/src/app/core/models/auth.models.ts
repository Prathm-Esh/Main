export interface LoginRequest {
  userId: string;
  password: string;
}

export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: number;
}
