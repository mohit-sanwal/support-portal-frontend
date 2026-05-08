"use client";

import { updateTicket } from "../../lib/api";

const STATUSES = ["OPEN", "IN_PROGRESS", "IN_REVIEW", "IN_QE", "DONE"];

export default function StatusDropdown({
  ticketId,
  value,
  onChange,
}: {
  ticketId: number;
  value: string;
  onChange: () => void;
}) {
  const handleChange = async (status: string) => {
    await updateTicket(ticketId, { status });
    onChange();
  };

  return (
    <select
      className="dropdown"
      value={value}
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