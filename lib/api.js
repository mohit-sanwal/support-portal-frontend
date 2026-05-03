const BASE_URL = "http://localhost:5000/api";

export const getTickets = async () => {
  const res = await fetch(`${BASE_URL}/tickets`);
  return res.json();
};

export const createTicket = async (data) => {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateTicket = async (id, data) => {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteTicket = async (id) => {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "DELETE",
  });

  return res.json();
};