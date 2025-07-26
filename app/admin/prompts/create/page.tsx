"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePrompt() {
  const [form, setForm] = useState({ title: "", prompt: "", category: "" });
  const router = useRouter();

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/admin/prompts");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold">Create New Prompt</h2>
      <input name="title" value={form.title} onChange={handleChange} required placeholder="Title" className="w-full px-4 py-2 text-black" />
      <input name="category" value={form.category} onChange={handleChange} required placeholder="Category" className="w-full px-4 py-2 text-black" />
      <textarea name="prompt" value={form.prompt} onChange={handleChange} required placeholder="Prompt" rows={4} className="w-full px-4 py-2 text-black" />
      <button type="submit" className="px-4 py-2 bg-lime-400 text-black rounded">Save</button>
    </form>
  );
}