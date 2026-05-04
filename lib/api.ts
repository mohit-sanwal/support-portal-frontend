import {LoginRequest, RegisterRequest, AuthResponse , ErrorResponse, Ticket, AuthRequest } from '../types'

const BASE_URL = `${process.env.API_BASE_URL}/api`;



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

// ---------------- API ----------------

// ✅ GET tickets (FIXED: added token)
export const getTickets = async (): Promise<Ticket[]> => {
  const res = await fetch(`${BASE_URL}/tickets`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch tickets");

  return res.json();
};

// ✅ CREATE ticket
export const createTicket = async (
  data: Partial<Ticket>
): Promise<Ticket> => {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create ticket");

  return res.json();
};

// ✅ UPDATE ticket
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

// ✅ DELETE ticket
export const deleteTicket = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete ticket");

  return res.json();
};

// ---------------- AUTH ----------------

// ❌ token removed (IMPORTANT FIX)
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

  const jsonData = await res.json(); // ✅ FIXED

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

// ---------------- LOGOUT ----------------
export const logout = (): void => {
  localStorage.removeItem("token");
};