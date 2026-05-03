"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerApi } from "../../lib/api";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault(); // 🔥 Enter + reload prevent

    try {
      await registerApi({ username, password });
      alert("User registered successfully!");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Register</button>
    </form>
  );
}