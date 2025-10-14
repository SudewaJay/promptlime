"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

interface Prompt {
  id: string;
  name: string;
}

export default function EditPromptPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchPrompt = async (): Promise<void> => {
      try {
        const res = await fetch(`/api/prompts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch prompt");

        const data: Prompt = await res.json();
        setName(data.name || "");
      } catch (error) {
        console.error("Error fetching prompt:", error);
      }
    };

    if (id) fetchPrompt();
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to update prompt");

      router.push("/admin/prompts");
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Prompt</h1>
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