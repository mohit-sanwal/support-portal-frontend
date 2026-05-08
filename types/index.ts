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
  role: string;
}

export interface ErrorResponse {
  error: string;
}


export interface Ticket {
  id: number;
  title: string;
  description?: string;

  status: string;

  assigned_to?: number;
  assigned_to_name?: string;

  created_by?: number;
  created_by_name?: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface ApiMessage {
  message: string;
}

export interface Comment {
 id: number;
  content: string;
  username: string;
  created_at: string;
  replies: Comment[];
}