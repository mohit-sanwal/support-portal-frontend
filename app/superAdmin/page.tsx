
"use client";

import { useEffect, useState } from "react";
import OverlayLoader from "@/components/loader/OverlayLoader";
import { useRouter } from "next/navigation";
import styles from "./SuperAdmin.module.css";

import {
  ArrowLeft,
  ShieldCheck,
  Shield,
  UserCircle2,
  UserCog,
  Trash2,
  UserRoundX,
} from "lucide-react";

import {
  getUsersApi,
  makeAdminApi,
  makeUserApi,
  deleteUserApi,
} from "../../lib/api";

import { User } from "../../types";

export default function SuperAdmin() {
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

  const handleMakeAdmin = async (id: number) => {
    try {
      setLoading(true);
      await makeAdminApi(id);
      fetchUsers();
    } catch(err: any) {
      console.error(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeUser = async (id: number) => {
    try {
      setLoading(true);
      await makeUserApi(id);
      fetchUsers();
    } catch(err: any) {
      console.error(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
    
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      setLoading(true);
      await deleteUserApi(id);
      fetchUsers();
    } catch(err: any) {
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
          <ShieldCheck size={24} />
          Super Admin Panel
        </h2>
      </div>

      {/* TABLE */}
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

            <div className={styles.actions}>
              {user.role !== "super_admin" && (
                <>
                  {user.role !== "admin" && (
                    <button
                      className={styles.promote}
                      onClick={() =>
                        handleMakeAdmin(user.id)
                      }
                    >
                      <UserCog size={14} />
                      Make Admin
                    </button>
                  )}

                  {user.role === "admin" && (
                    <button
                      className={styles.makeUser}
                      onClick={() =>
                        handleMakeUser(user.id)
                      }
                    >
                      <UserRoundX size={14} />
                      Make User
                    </button>
                  )}

                  <button
                    className={styles.delete}
                    onClick={() =>
                      handleDelete(user.id)
                    }
                  >
                    <Trash2 size={14} />
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