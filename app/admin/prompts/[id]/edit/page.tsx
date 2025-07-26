"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPrompt() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", category: "", prompt: "" });

  useEffect(() => {
    fetch(`/api/prompts/${params.id}`)
      .then(res => res.json())
      .then(data => setForm(data.data));
  }, [params.id]);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch(`/api/prompts/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/admin/prompts");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold">Edit Prompt</h2>
      <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-2 text-black" />
      <input name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 text-black" />
      <textarea name="prompt" value={form.prompt} onChange={handleChange} rows={4} className="w-full px-4 py-2 text-black" />
      <button type="submit" className="px-4 py-2 bg-lime-400 text-black rounded">Update</button>
    </form>
  );
}