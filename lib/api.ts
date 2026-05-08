import {
  LoginRequest,
  RegisterRequest, 
  AuthResponse , 
  ErrorResponse, 
  Ticket, 
  AuthRequest, 
  User,
  ApiMessage
} from '../types'


console.log('base url--- ', `${process.env.NEXT_PUBLIC_API_BASE_URL}`)
const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;



// ---------------- HELPERS ----------------
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const admin_or_superAdmin = (role: any) => {
  return ['admin', 'super_admin'].includes(role);
}

// ---------------- API ----------------

// GET tickets (FIXED: added token)
export const getTickets = async (): Promise<Ticket[]> => {
  const res = await fetch(`${BASE_URL}/tickets`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch tickets");

  return res.json();
};

// CREATE ticket
export const createTicket = async (
  data: Partial<Ticket>
): Promise<Ticket> => {
  const res = await fetch(`${BASE_URL}/create-ticket`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create ticket");

  return res.json();
};

// UPDATE ticket
export const updateTicket = async (
  id: number,
  data: Partial<Ticket>
): Promise<Ticket> => {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update ticket");

  return res.json();
};

// DELETE ticket
export const deleteTicket = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete ticket");

  return res.json();
};

// ---------------- AUTH ----------------

// token removed (IMPORTANT FIX)
export const registerApi = async (
  data: AuthRequest
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const jsonData = await res.json(); // FIXED

  if (!res.ok) throw new Error(jsonData.error);

  return jsonData;
};

export const loginApi = async (
  data: AuthRequest
): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const jsonData = await res.json();

  if (!res.ok) throw new Error(jsonData.error);

  return jsonData;
};


export const getUsersApi = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const jsonData = await res.json();

  if (!res.ok) throw new Error(jsonData.error);

  return jsonData;
};

export const makeAdminApi = async (id: number): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/users/${id}/make-admin`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const jsonData = await res.json();

  if (!res.ok) throw new Error(jsonData.error);

  return jsonData;
};


export const demoteUserApi = async (id: number): Promise<ApiMessage> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/users/${id}/demote`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const jsonData = await res.json();

  if (!res.ok) throw new Error(jsonData.error);

  return jsonData;
};


export const deleteUserApi = async (id: number): Promise<ApiMessage> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const jsonData = await res.json();

  if (!res.ok) throw new Error(jsonData.error);

  return jsonData;
};


export const getCurrentUserApi = async (): Promise<User> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/auth/current-user`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
};


export const getAssignableUsersApi = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/users/assignable`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);

  return data;
};


export const assignTicketApi = async (
  ticketId: number,
  userId: number
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/tickets/${ticketId}/assign`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);

  return data;
};


export const addCommentApi = async (
  ticketId: number,
  data: { content: string; parent_id?: number }
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/tickets/${ticketId}/comments`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  if (!res.ok) throw new Error(json.error);

  return json;
};

export const getCommentsApi = async (ticketId: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/tickets/${ticketId}/comments`,
    {
      headers: getAuthHeaders(),
    }
  );

  const json = await res.json();

  if (!res.ok) throw new Error(json.error);

  return json;
};

export const updateCommentApi = async (
  id: number,
  data: { content: string }
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.error);

  return json;
};

export const deleteCommentApi = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE",
    headers:getAuthHeaders(),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.error);

  return json;
};



// ---------------- LOGOUT ----------------
export const logout = (): void => {
  localStorage.removeItem("token");
};