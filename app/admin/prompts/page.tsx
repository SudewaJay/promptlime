"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Edit, Plus } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type Prompt = {
  _id: string;
  title: string;
  category: string;
  prompt: string;
  createdAt: string;
  views: number;
  copyCount: number;
};

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await fetch("/api/prompts");
      const data = await res.json();
      // Ensure data is an array (api returns array directly or { prompts: [] } depending on implementation)
      // Based on route.ts: return NextResponse.json(prompts, { status: 200 });
      setPrompts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch prompts", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;

    try {
      const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPrompts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete prompt");
      }
    } catch (error) {
      console.error("Failed to delete prompt", error);
    }
  };

  const filteredPrompts = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Prompt Management</h1>
          <p className="text-white/60 text-sm mt-1">
            Create, edit, and moderate prompts.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-lime-400 transition"
            />
          </div>

          <Link
            href="/submit"
            className="flex items-center gap-2 bg-lime-400 text-black px-4 py-2 rounded-full font-semibold hover:bg-lime-300 transition text-sm whitespace-nowrap"
          >
            <Plus size={18} /> Add New
          </Link>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-xs uppercase text-white/50 tracking-wider">
                <th className="p-4 font-semibold">Prompt</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Stats</th>
                <th className="p-4 font-semibold">Created</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-white/60">Loading prompts...</td></tr>
              ) : filteredPrompts.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-white/60">No prompts found.</td></tr>
              ) : (
                filteredPrompts.map((prompt) => (
                  <tr key={prompt._id} className="hover:bg-white/5 transition">
                    <td className="p-4 max-w-xs">
                      <div className="font-medium text-white truncate">{prompt.title}</div>
                      <div className="text-xs text-white/40 truncate">{prompt.prompt}</div>
                    </td>
                    <td className="p-4 text-sm text-lime-400">
                      {prompt.category}
                    </td>
                    <td className="p-4 text-xs text-white/60 space-y-1">
                      <div>👁️ {prompt.views || 0}</div>
                      <div>📋 {prompt.copyCount || 0}</div>
                    </td>
                    <td className="p-4 text-sm text-white/60">
                      {prompt.createdAt ? formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true }) : "-"}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/prompts/edit/${prompt._id}`}
                        className="inline-block p-1.5 text-white/40 hover:text-white transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => deletePrompt(prompt._id)}
                        className="p-1.5 text-white/40 hover:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}