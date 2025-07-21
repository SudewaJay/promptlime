"use client";

import { useState } from "react";

export default function PromptForm() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    prompt: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ title: "", category: "", prompt: "", image: "" });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("❌ Error submitting prompt.");
      }
    } catch (err) {
      console.error("Server error:", err); // ✅ using 'err' here to fix ESLint warning
      alert("❌ Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-md max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-white mb-4">➕ Submit a Prompt</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full mb-3 px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 rounded-md bg-white/10 text-white border border-white/20"
      >
        <option value="">Select Category</option>
        <option value="Image Generation">Image Generation</option>
        <option value="UX Writing">UX Writing</option>
        <option value="Productivity">Productivity</option>
        <option value="Coding">Coding</option>
      </select>

      <textarea
        name="prompt"
        value={form.prompt}
        onChange={handleChange}
        placeholder="Your prompt..."
        required
        rows={4}
        className="w-full mb-3 px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/50 border border-white/20"
      />

      <input
        name="image"
        value={form.image}
        onChange={handleChange}
        placeholder="Image URL (optional)"
        className="w-full mb-3 px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/50 border border-white/20"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-lime-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-lime-300 transition-all disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Prompt"}
      </button>

      {success && (
        <p className="mt-3 text-green-400 text-sm">
          ✅ Prompt submitted successfully!
        </p>
      )}
    </form>
  );
}