"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTickets = async () => {
    const res = await fetch("http://localhost:5000/api/tickets");
    const data = await res.json();
    setTickets(data);
  };

  const createTicket = async () => {
    await fetch("http://localhost:5000/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTickets();
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Support Portal</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter ticket"
      />
      <button onClick={createTicket}>Create</button>

      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            {t.title} - {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}