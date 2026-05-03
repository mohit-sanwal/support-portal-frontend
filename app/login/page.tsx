"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginApi } from "../../lib/api";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await loginApi({ username, password });
      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <p>
        New user? <Link href="/register">Register here</Link>
      </p>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}