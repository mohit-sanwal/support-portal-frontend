"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../lib/api";
import {
  getTickets,
  updateTicket,
  deleteTicket,
  createTicket,
} from "../lib/api";

interface Ticket {
  id: number;
  title: string;
  status: string;
  priority: string;
}

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const router = useRouter();


  const handleLogout = () => {
    logout(); // token remove
    router.push("/login");
  };

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      loadTickets();
    }
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      await createTicket({ title });
      setTitle("");
      loadTickets();
  };

  const handleStatus = async (id: number, status: string) => {
    await updateTicket(id, { status });
    loadTickets();
  };

  const handleDelete = async (id: number) => {
    await deleteTicket(id);
    loadTickets();
  };

  return (
    <div className="container">
      <div className="topbar">
        <h1>Support Portal</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <form className="create-box" onSubmit={handleCreate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Create new ticket..."
        />
        <button type="submit" disabled={loading}> Create </button>
      </form>

      {/* Loader */}
      {loading && <div className="loader">Loading...</div>}

      {/* Empty State */}
      {!loading && tickets.length === 0 && (
        <div className="empty">
            No tickets yet 🚀 Create your first one!
        </div>
      )}

      {/* Table */}
      {!loading && tickets.length > 0 && (
        <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>

                <td>
                  <span className={`badge ${t.status}`}>
                    {t.status}
                  </span>
                </td>

                <td>
                  <div className="actions">
                    <button
                      className="btn start"
                      onClick={() => handleStatus(t.id, "IN_PROGRESS")}
                    >
                      ▶ Start
                    </button>

                    <button
                      className="btn done"
                      onClick={() => handleStatus(t.id, "DONE")}
                    >
                      ✔ Done
                    </button>

                    <button
                      className="btn delete"
                      onClick={() => handleDelete(t.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}