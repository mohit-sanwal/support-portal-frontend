"use client";

import {useState} from 'react'
import toast from "react-hot-toast";

import { updateTicket } from "../../lib/api";

const STATUSES = [ "OPEN", "IN_PROGRESS", "IN_REVIEW", "IN_QE", "DONE"];

export default function StatusDropdown({
  ticketId,
  value,
  onChange,
}: {
  ticketId: number;
  value: string;
  onChange: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(value);
  const handleChange = async (status: string) => {
    setLoading(true);
    const previous = selectedStatus;
    try {
      setSelectedStatus(status);
      await updateTicket(ticketId, { status });

      onChange();

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setSelectedStatus(previous);
    }
    setLoading(false);
  };

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
      value={selectedStatus || ""}
      onChange={(e) => handleChange(e.target.value)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}