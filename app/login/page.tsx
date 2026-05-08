"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "../auth.module.css";

import { loginApi } from "../../lib/api";

export default function Login() {
  const [username, setUsername] =
    useState<string>("");

  const [password, setPassword] =
    useState<string>("");

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const router = useRouter();

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const data = await loginApi({
        username,
        password,
      });

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      router.push("/");
    } catch (err: unknown) {
      setError("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className={styles.authPage}>
      <form
        className={styles.authCard}
        onSubmit={handleLogin}
      >
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            Welcome Back
          </h1>

          <p className={styles.authSubtitle}>
            Login to manage tickets and
            track issues
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
              placeholder="Enter username"
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
              placeholder="Enter password"
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
              ? "Logging in..."
              : "Login"}
          </button>
        </div>

        <div className={styles.authFooter}>
          Don&apos;t have an account?{" "}
          <Link href="/register">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}