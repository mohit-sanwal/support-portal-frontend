
"use client";

import { useEffect, useState } from "react";
import OverlayLoader from "@/components/loader/OverlayLoader";

import { useRouter } from "next/navigation";

import { Shield, ArrowLeft, ShieldCheck, UserCircle2 } from "lucide-react";

import { getUsersApi } from "../../lib/api";

import styles from "../superAdmin/SuperAdmin.module.css";

import { User } from "../../types";

export default function Admin() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter();

   const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsersApi();
      setUsers(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      {loading && (
                    <OverlayLoader show={loading} />
                  )}
      {/* HEADER */}
      <div className={styles.headerTop}>

        <button
          className={styles.backBtn}
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h2 className={styles.title}>
          <Shield size={22} />
          Admin Panel
        </h2>
      </div>

      {/* TABLE */}
      <div className={styles.table}>

        <div className={styles.adminHeader}>
          <span>Username</span>
          <span>Role</span>
        </div>

        {users.map((user) => (
          <div key={user.id} className={styles.adminRow}>

            <span>{user.username}</span>

            <span className={styles.role}>
              {user.role === "super_admin" && (
                  <div className={styles.roleBadge}>
                    <ShieldCheck size={16} />
                    Super Admin
                  </div>
                )}

                {user.role === "admin" && (
                  <div className={styles.roleBadge}>
                    <Shield size={16} />
                    Admin
                  </div>
                )}

                {user.role === "user" && (
                  <div className={styles.roleBadge}>
                    <UserCircle2 size={16} />
                    User
                  </div>
                )}

            </span>

          </div>
        ))}
      </div>
    </div>
  );
}