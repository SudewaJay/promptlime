"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Sparkles } from "lucide-react";

type Tool = {
    _id: string;
    name: string;
    slug: string;
    icon?: string;
};

export default function AdminToolsPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [newTool, setNewTool] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            const res = await fetch("/api/tools");
            const data = await res.json();
            setTools(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch tools", error);
        } finally {
            setLoading(false);
        }
    };

    const addTool = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTool.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newTool }),
            });

            if (res.ok) {
                setNewTool("");
                fetchTools();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to add tool");
            }
        } catch (error) {
            console.error("Failed to add tool", error);
        } finally {
            setSubmitting(false);
        }
    };

    const deleteTool = async (id: string) => {
        if (!confirm("Are you sure? This will remove the tool from filtering options.")) return;

        try {
            const res = await fetch(`/api/tools?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setTools((prev) => prev.filter((t) => t._id !== id));
            } else {
                alert("Failed to delete tool");
            }
        } catch (error) {
            console.error("Failed to delete tool", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tool Management</h1>
                    <p className="text-white/60 text-sm mt-1">
                        Manage AI tools (ChatGPT, Gemini, etc.) for categorization.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Add New Tool */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-lime-400" /> Add New Tool
                    </h2>
                    <form onSubmit={addTool} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Tool Name</label>
                            <input
                                type="text"
                                value={newTool}
                                onChange={(e) => setNewTool(e.target.value)}
                                placeholder="e.g. Claude, Midjourney"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 transition"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-lime-400 text-black font-semibold py-2.5 rounded-lg hover:bg-lime-300 transition disabled:opacity-50"
                        >
                            {submitting ? "Adding..." : "Add Tool"}
                        </button>
                    </form>
                </div>

                {/* List Tools */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-lime-400" /> Existing Tools
                    </h2>

                    {loading ? (
                        <div className="text-white/40 text-center py-4">Loading tools...</div>
                    ) : tools.length === 0 ? (
                        <div className="text-white/40 text-center py-4">No tools found. Add one!</div>
                    ) : (
                        <div className="space-y-3">
                            {tools.map((tool) => (
                                <div key={tool._id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/20 transition">
                                    <div>
                                        <div className="font-medium text-white">{tool.name}</div>
                                        <div className="text-xs text-white/40 font-mono">{tool.slug}</div>
                                    </div>
                                    <button
                                        onClick={() => deleteTool(tool._id)}
                                        className="p-2 text-white/40 hover:text-red-400 transition"
                                        title="Delete Tool"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
