// app/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Sign in to Admin Panel</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="px-6 py-3 rounded bg-lime-500 text-black font-semibold hover:bg-lime-400 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}