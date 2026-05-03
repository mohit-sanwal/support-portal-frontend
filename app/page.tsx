"use client";

import { useEffect, useState } from "react";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../lib/api";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");

  const loadTickets = async () => {
    const data = await getTickets();
    setTickets(data);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreate = async () => {
    if (!title) return;

    await createTicket({ title });
    setTitle("");
    loadTickets();
  };

  const handleStatusChange = async (id, status) => {
    await updateTicket(id, { status });
    loadTickets();
  };

  const handleDelete = async (id) => {
    await deleteTicket(id);
    loadTickets();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Support Portal</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter ticket"
      />
      <button onClick={handleCreate}>Create</button>

      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            <b>{t.title}</b> - {t.status}
            <button onClick={() => handleStatusChange(t.id, "IN_PROGRESS")}>
              Start
            </button>
            <button onClick={() => handleStatusChange(t.id, "DONE")}>
              Done
            </button>
            <button onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}