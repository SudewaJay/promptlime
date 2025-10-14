"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Prompt {
  _id: string;
  title: string;
  prompt: string;
  category: string;
}

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    const fetchPrompts = async (): Promise<void> => {
      try {
        const res = await fetch("/api/prompts");
        const data = await res.json();
        setPrompts(data.prompts || []);
      } catch (error) {
        console.error("Error fetching prompts:", error);
      }
    };

    fetchPrompts();
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete prompt");
      setPrompts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Prompts</h1>

      <Link
        href="/admin/prompts/create"
        className="text-lime-400 hover:text-lime-300 transition-colors"
      >
        ➕ Add New Prompt
      </Link>

      <ul className="mt-6 space-y-3">
        {prompts.map((prompt) => (
          <li key={prompt._id} className="border-b border-white/10 pb-2">
            <div className="flex justify-between items-center">
              <span className="text-white">{prompt.title}</span>
              <div className="space-x-4">
                <Link
                  href={`/admin/prompts/${prompt._id}/edit`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(prompt._id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}