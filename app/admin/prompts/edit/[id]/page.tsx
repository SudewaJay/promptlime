"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use() for Next.js 15+
    const { id } = use(params);

    const [form, setForm] = useState({
        title: "",
        category: "",
        prompt: "",
        image: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPrompt();
    }, [id]);

    const fetchPrompt = async () => {
        try {
            const res = await fetch(`/api/prompts/${id}`);
            const data = await res.json();
            if (data.data) {
                setForm({
                    title: data.data.title || "",
                    category: data.data.category || "",
                    prompt: data.data.prompt || "",
                    image: data.data.image || "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch prompt", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/prompts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert("✅ Prompt updated successfully!");
                router.push("/admin/prompts");
            } else {
                alert("❌ Failed to update prompt.");
            }
        } catch (error) {
            console.error("Failed to update prompt", error);
            alert("❌ Error updating prompt.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/prompts" className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white">Edit Prompt</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
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

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Prompt</label>
                    <textarea
                        name="prompt"
                        value={form.prompt}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition resize-y font-mono text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Image URL</label>
                    <input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link
                        href="/admin/prompts"
                        className="px-6 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition font-medium"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-lime-400 text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-lime-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
