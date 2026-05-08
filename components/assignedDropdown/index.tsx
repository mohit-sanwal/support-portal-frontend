"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { assignTicketApi } from "../../lib/api";
import { User } from "../../types";
import styles from "./AssignedDropdown.module.css";

interface Props {
  ticketId: number;
  onAssigned: () => void;
  value: number | undefined;
  users: User[]
}

export default function AssignDropdown({ ticketId, onAssigned, value, users}: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(value);

  const handleAssign = async (userId: number) => {
    setSelectedUserId(userId);
    setLoading(true);
    const previous = selectedUserId;
    try {
      await assignTicketApi(ticketId, userId);
      onAssigned();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setSelectedUserId(previous);
    }
    setLoading(false);
  };

  if (users.length === 0) return null;

  if (loading) {
    return (
      <div className="miniLoader">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
   <select
    className="dropdown"
    value={selectedUserId || ""}
    onChange={(e) => handleAssign(Number(e.target.value))}
   >
    <option value="">Unassigned</option>
    {users.map((u) => (
        <option key={u.id} value={u.id}>
        {u.username}
        </option>
    ))}
    </select>
  );
}