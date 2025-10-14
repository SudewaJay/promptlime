"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface PromptForm {
  title: string;
  prompt: string;
  category: string;
}

export default function CreatePrompt() {
  const [form, setForm] = useState<PromptForm>({
    title: "",
    prompt: "",
    category: "",
  });
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create prompt");

      router.push("/admin/prompts");
    } catch (error) {
      console.error("Error creating prompt:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold">Create New Prompt</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        required
        placeholder="Title"
        className="w-full px-4 py-2 text-black rounded bg-white/10 border border-white/20"
      />

      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        placeholder="Category"
        className="w-full px-4 py-2 text-black rounded bg-white/10 border border-white/20"
      />

      <textarea
        name="prompt"
        value={form.prompt}
        onChange={handleChange}
        required
        placeholder="Prompt"
        rows={4}
        className="w-full px-4 py-2 text-black rounded bg-white/10 border border-white/20"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-lime-400 text-black font-semibold rounded hover:bg-lime-300"
      >
        Save
      </button>
    </form>
  );
}