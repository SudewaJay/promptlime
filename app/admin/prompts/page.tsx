"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/prompts")
      .then(res => res.json())
      .then(data => setPrompts(data.prompts || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Prompts</h1>
      <Link href="/admin/prompts/create" className="text-lime-400">➕ Add New Prompt</Link>
      <ul className="mt-6 space-y-3">
        {prompts.map((prompt) => (
          <li key={prompt._id} className="border-b pb-2">
            <div className="flex justify-between">
              <span>{prompt.title}</span>
              <div className="space-x-4">
                <Link href={`/admin/prompts/${prompt._id}/edit`} className="text-blue-400">Edit</Link>
                <button
                  onClick={async () => {
                    await fetch(`/api/prompts/${prompt._id}`, { method: "DELETE" });
                    setPrompts(prev => prev.filter(p => p._id !== prompt._id));
                  }}
                  className="text-red-500"
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