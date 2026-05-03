export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface ErrorResponse {
  error: string;
}


export interface Ticket {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}
