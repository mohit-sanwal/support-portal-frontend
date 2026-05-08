"use client";

import { useEffect, useState } from "react";
import { getAssignableUsersApi, assignTicketApi } from "../../lib/api";
import { User } from "../../types";
import styles from "./AssignedDropdown.module.css";

interface Props {
  ticketId: number;
  onAssigned: () => void;
  value: number | undefined;
}

export default function AssignDropdown({ ticketId, onAssigned, value }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(value);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAssignableUsersApi();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadUsers();
  }, []);

  const handleAssign = async (userId: number) => {
    setLoading(true);
    try {
      await assignTicketApi(ticketId, userId);
      onAssigned();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (users.length === 0) return null;

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