// ✅ File: app/admin/categories/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    router.push("/admin/categories");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
          className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white"
        />
        <button
          type="submit"
          className="bg-lime-500 text-black font-semibold px-6 py-2 rounded hover:bg-lime-400"
        >
          Save
        </button>
      </form>
    </div>
  );
}
