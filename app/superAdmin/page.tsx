"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SuperAdmin.module.css";
import {
  getUsersApi,
  makeAdminApi,
  demoteUserApi,
  deleteUserApi,
} from "../../lib/api";


export default function SuperAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const data = await getUsersApi();
      setUsers(data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMakeAdmin = async (id: number) => {
    await makeAdminApi(id);
    fetchUsers();
  };

  const handleDemote = async (id: number) => {
    await demoteUserApi(id);
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await deleteUserApi(id);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
        <div className={styles.headerTop}>
            <button
                className={styles.backBtn}
                onClick={() => router.push("/")}
            >
                ⬅ Back
            </button>

            <h2 className={styles.title}>Super Admin Panel</h2>
        </div>
      <div className={styles.table}>
        <div className={styles.header}>
          <span>Username</span>
          <span>Role</span>
          <span>Actions</span>
        </div>
        {users.map((user) => (
          <div key={user.id} className={styles.row}>
            <span>{user.username}</span>

            <span className={styles.role}>
              {user.role === "super_admin" ? "🔥 Super Admin" : user.role}
            </span>

            <div className={styles.actions}>
              {user.role !== "super_admin" && (
                <>
                  {user.role !== "admin" && (
                    <button
                      className={styles.promote}
                      onClick={() => handleMakeAdmin(user.id)}
                    >
                      Make Admin
                    </button>
                  )}

                  {user.role === "admin" && (
                    <button
                      className={styles.demote}
                      onClick={() => handleDemote(user.id)}
                    >
                      Demote
                    </button>
                  )}

                  <button
                    className={styles.delete}
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}