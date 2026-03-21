"use client";

import { useState, useEffect } from "react";

type Tool = {
  _id: string;
  name: string;
  slug: string;
};

export default function PromptForm() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    tool: "",
    tags: "",
    prompt: "",
    image: "",
    styleTag: "",
    useCaseTag: "",
    moodTag: "",
  });

  const STYLES = ["cinematic", "anime", "ghibli", "pixar", "watercolor", "oil-painting", "cyberpunk", "vintage", "fantasy", "minimal", "3d"];
  const USE_CASES = ["self-portrait", "product", "landscape", "group", "pet", "food"];
  const MOODS = ["dark", "vibrant", "warm", "dreamy", "retro", "minimal"];

  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await fetch("/api/tools");
        if (res.ok) {
          const data = await res.json();
          setTools(Array.isArray(data) ? data : []);

          // Set default tool if available
          if (Array.isArray(data) && data.length > 0) {
            const chatGpt = data.find((t: Tool) => t.slug === 'chatgpt');
            setForm(prev => ({ ...prev, tool: chatGpt ? chatGpt.name : data[0].name }));
          } else {
            setForm(prev => ({ ...prev, tool: "ChatGPT" })); // Fallback
          }
        }
      } catch (error) {
        console.error("Failed to fetch tools", error);
      }
    };
    fetchTools();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Process tags
    const processedTags = form.tags.split(",").map(t => t.trim()).filter(t => t.length > 0);

    const payload = {
      ...form,
      tags: processedTags,
    };

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setForm({ title: "", category: "", tool: form.tool, tags: "", prompt: "", image: "", styleTag: "", useCaseTag: "", moodTag: "" });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("❌ Error submitting prompt.");
      }
    } catch (err) {
      console.error("Server error:", err);
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

      <div className="grid grid-cols-2 gap-3 mb-3">
        <select
          name="tool"
          value={form.tool}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20"
        >
          <option value="" disabled>Select AI Tool</option>
          {tools.map(tool => (
            <option key={tool._id} value={tool.name}>{tool.name}</option>
          ))}
          {tools.length === 0 && <option value="ChatGPT">ChatGPT (Default)</option>}
        </select>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20"
        >
          <option value="">Select Category</option>
          <option value="Image Generation">Image Generation</option>
          <option value="UX Writing">UX Writing</option>
          <option value="Productivity">Productivity</option>
          <option value="Coding">Coding</option>
          <option value="Marketing">Marketing</option>
          <option value="SEO">SEO</option>
        </select>
      </div>

      <input
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="Tags (comma separated, e.g. funny, work, anime)"
        className="w-full mb-3 px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none"
      />

      {/* NEW TAGS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <select
          name="styleTag"
          value={form.styleTag}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20"
        >
          <option value="">Style (Optional)</option>
          {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          name="useCaseTag"
          value={form.useCaseTag}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20"
        >
          <option value="">Use Case (Optional)</option>
          {USE_CASES.map(u => <option key={u} value={u}>{u}</option>)}
        </select>

        <select
          name="moodTag"
          value={form.moodTag}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20"
        >
          <option value="">Mood (Optional)</option>
          {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

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