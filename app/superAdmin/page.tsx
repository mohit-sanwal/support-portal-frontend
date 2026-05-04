"use client";
import { useEffect, useState } from "react";
import {getUsersApi, makeAdminApi} from "../../lib/api"

export default function SuperAdmin() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
  try {
    const data = await getUsersApi();
    setUsers(data);
  } catch (err: any) {
    console.error(err.message);
  }
};

const handleMakeAdmin = async (id: number) => {
  try {
    await makeAdminApi(id);
    fetchUsers(); // refresh
  } catch (err: any) {
    console.error(err.message);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2> Super Admin Panel</h2>

      {users.map(user => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <span>{user.username} ({user.role})</span>

          {user.role !== "admin" && (
            <button onClick={() => makeAdmin(user.id)}>
              Make Admin
            </button>
          )}
        </div>
      ))}
    </div>
  );
}