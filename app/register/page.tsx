"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "../auth.module.css";

import { registerApi } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      await registerApi({
        username,
        password,
      });

      router.push("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Registration failed"
      );
    }

    setLoading(false);
  };

  return (
    <div className={styles.authPage}>
      <form
        className={styles.authCard}
        onSubmit={handleRegister}
      >
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            Create Account
          </h1>

          <p className={styles.authSubtitle}>
            Register to manage support
            tickets and collaborate with
            your team
          </p>
        </div>

        <div className={styles.authForm}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label>Username</label>

            <input
              type="text"
              placeholder="Choose username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>

            <input
              type="password"
              placeholder="Choose password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.authBtn}
          >
            {loading
              ? "Creating account..."
              : "Register"}
          </button>
        </div>

        <div className={styles.authFooter}>
          Already have an account?{" "}
          <Link href="/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}