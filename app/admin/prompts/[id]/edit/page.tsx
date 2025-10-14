"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

interface Prompt {
  _id: string;
  title: string;
  prompt: string;
  category: string;
}

export default function EditPromptPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState<Pick<Prompt, "title" | "prompt" | "category">>({
    title: "",
    prompt: "",
    category: "",
  });

  useEffect(() => {
    const fetchPrompt = async (): Promise<void> => {
      try {
        const res = await fetch(`/api/prompts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch prompt");

        const data: Prompt = await res.json();
        setForm({
          title: data.title,
          prompt: data.prompt,
          category: data.category,
        });
      } catch (error) {
        console.error("Error fetching prompt:", error);
      }
    };

    if (id) fetchPrompt();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Title"
          className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white"
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          placeholder="Category"
          className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white"
        />
        <textarea
          name="prompt"
          value={form.prompt}
          onChange={handleChange}
          required
          placeholder="Prompt"
          rows={4}
          className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-lime-500 text-black font-semibold rounded hover:bg-lime-400"
        >
          Update
        </button>
      </form>
    </div>
  );
}