"use client";
import { useEffect, useState } from "react";
import { getUsersApi } from "../../lib/api";
import styles from "../superAdmin/superAdmin.module.css";
import { useRouter } from "next/navigation";
import {User} from '../../types'

export default function Admin() {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerTop}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/")}
        >
          ⬅ Back
        </button>

        <h2 className={styles.title}>Admin Panel</h2>
      </div>

      {/* Table / Cards */}
      <div className={styles.table}>
        <div className={styles.header}>
          <span>Username</span>
          <span>Role</span>
        </div>

        {users.map((user) => (
          <div key={user.id} className={styles.row}>
            <span>{user.username}</span>

            <span className={styles.role}>
              {user.role === "super_admin"
                ? "🔥 Super Admin"
                : user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}