import {
  Ticket,
  AuthResponse,
  AuthRequest,
  User,
  ApiMessage
} from "../types";

console.log(
  "base url--- ",
  `${process.env.NEXT_PUBLIC_API_BASE_URL}`
);

const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;


// ---------------- HELPERS ----------------

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const logoutUser = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("role");

  window.location.href = "/login";
};

export const admin_or_superAdmin = (
  role: any
) => {
  return ["admin", "super_admin"].includes(role);
};


// COMMON FETCH WRAPPER
const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true
) => {

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // protected routes only
  if (requiresAuth) {

    const token = getToken();

    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    }
  );

  // invalid / expired token
  if (res.status === 401) {

    logoutUser();

    throw new Error("Invalid token");
  }

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.error || "Something went wrong"
    );
  }

  return data;
};


// ---------------- TICKETS ----------------

export const getTickets = async (): Promise<
  Ticket[]
> => {

  return apiFetch("/tickets");
};

export const createTicket = async (
  data: Partial<Ticket>
): Promise<Ticket> => {

  return apiFetch("/create-ticket", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTicket = async (
  id: number,
  data: Partial<Ticket>
): Promise<Ticket> => {

  return apiFetch(`/tickets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteTicket = async (
  id: number
): Promise<ApiMessage> => {

  return apiFetch(`/tickets/${id}`, {
    method: "DELETE",
  });
};


// ---------------- AUTH ----------------

export const registerApi = async (
  data: AuthRequest
): Promise<ApiMessage> => {

  return apiFetch(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false
  );
};

export const loginApi = async (
  data: AuthRequest
): Promise<AuthResponse> => {

  return apiFetch(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false
  );
};


// ---------------- USERS ----------------

export const getUsersApi = async (): Promise<
  User[]
> => {

  return apiFetch("/users");
};

export const makeAdminApi = async (
  id: number
): Promise<ApiMessage> => {

  return apiFetch(`/users/${id}/make-admin`, {
    method: "PATCH",
  });
};

export const makeUserApi = async (
  id: number
): Promise<ApiMessage> => {

  return apiFetch(`/users/${id}/make-user`, {
    method: "PATCH",
  });
};

export const deleteUserApi = async (
  id: number
): Promise<ApiMessage> => {

  return apiFetch(`/users/${id}`, {
    method: "DELETE",
  });
};

export const getCurrentUserApi = async (): Promise<User> => {

  return apiFetch("/auth/current-user");
};

export const getAssignableUsersApi = async (): Promise<User[]> => {

  return apiFetch("/users/assignable");
};


// ---------------- ASSIGN ----------------

export const assignTicketApi = async (
  ticketId: number,
  userId: number
) => {

  return apiFetch(
    `/tickets/${ticketId}/assign`,
    {
      method: "POST",

      body: JSON.stringify({
        assigned_to: userId,
      }),
    }
  );
};


// ---------------- COMMENTS ----------------

export const addCommentApi = async (
  ticketId: number,
  data: {
    content: string;
    parent_id?: number;
  }
) => {

  return apiFetch(
    `/tickets/${ticketId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

export const getCommentsApi = async (
  ticketId: number
) => {

  return apiFetch(
    `/tickets/${ticketId}/comments`
  );
};

export const updateCommentApi = async (
  id: number,
  data: { content: string }
) => {

  return apiFetch(`/comments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteCommentApi = async (
  id: number
) => {

  return apiFetch(`/comments/${id}`, {
    method: "DELETE",
  });
};


// ---------------- LOGOUT ----------------

export const logout = (): void => {
  logoutUser();
};