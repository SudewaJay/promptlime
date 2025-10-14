"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.ok) {
      router.push("/admin");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="space-y-4 bg-[#111] p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>

        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            name="username"
            className="w-full px-3 py-2 rounded bg-[#222] text-white border border-white/10"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-3 py-2 rounded bg-[#222] text-white border border-white/10"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-lime-500 hover:bg-lime-400 text-black font-bold py-2 rounded"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}