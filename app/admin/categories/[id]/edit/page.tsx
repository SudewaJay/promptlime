// app/admin/categories/[id]/edit/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CategoryType } from "@/types";
import toast from "react-hot-toast";

// your component code continues...

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch(`/api/categories/${id}`);
      const data = await res.json();
      setName(data.name || "");
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    router.push("/admin/categories");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white"
        />
        <button
          type="submit"
          className="bg-lime-500 text-black font-semibold px-6 py-2 rounded hover:bg-lime-400"
        >
          Update
        </button>
      </form>
    </div>
  );
}