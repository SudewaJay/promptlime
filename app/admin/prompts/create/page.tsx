"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { getImageUrl } from "@/lib/r2";

type Tool = {
    _id: string;
    name: string;
    slug: string;
};

export default function CreatePromptPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        category: "",
        prompt: "",
        image: "",
        tool: "",
        tags: "",
        styleTag: "",
        useCaseTag: "",
        moodTag: "",
    });

    const STYLES = ["cinematic", "anime", "ghibli", "pixar", "watercolor", "oil-painting", "cyberpunk", "vintage", "fantasy", "minimal", "3d"];
    const USE_CASES = ["self-portrait", "product", "landscape", "group", "pet", "food"];
    const MOODS = ["dark", "vibrant", "warm", "dreamy", "retro", "minimal"];

    const [tools, setTools] = useState<Tool[]>([]);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchTools = async () => {
            const res = await fetch("/api/tools");
            if (res.ok) {
                const data = await res.json();
                setTools(Array.isArray(data) ? data : []);
            }
        };
        fetchTools();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.fileKey) {
                setForm(prev => ({ ...prev, image: data.fileKey }));
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error("Upload error", error);
            alert("Error uploading file.");
        } finally {
            setUploading(false);
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
            const payload = {
                ...form,
                tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
            };

            const res = await fetch("/api/prompts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("✅ Prompt created successfully!");
                router.push("/admin/prompts");
            } else {
                alert("❌ Failed to create prompt.");
            }
        } catch (error) {
            console.error("Failed to create prompt", error);
            alert("❌ Error creating prompt.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/prompts" className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white">Create New Prompt</h1>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Tool</label>
                        <select
                            name="tool"
                            value={form.tool}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                        >
                            <option value="">Select AI Tool</option>
                            {tools.map((t) => (
                                <option key={t._id} value={t.name}>{t.name}</option>
                            ))}
                            <option value="ChatGPT">ChatGPT (Default)</option>
                        </select>
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
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Tags (comma separated)</label>
                    <input
                        name="tags"
                        value={form.tags}
                        onChange={handleChange}
                        placeholder="e.g. funny, work, anime"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Style</label>
                        <select
                            name="styleTag"
                            value={form.styleTag}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                        >
                            <option value="">Select Style</option>
                            {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Use Case</label>
                        <select
                            name="useCaseTag"
                            value={form.useCaseTag}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                        >
                            <option value="">Select Use Case</option>
                            {USE_CASES.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Mood</label>
                        <select
                            name="moodTag"
                            value={form.moodTag}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                        >
                            <option value="">Select Mood</option>
                            {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
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

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-white/60 mb-2">Image</label>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {form.image && (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                <SafeImage
                                    src={getImageUrl(form.image, 200)}
                                    alt="Preview"
                                    fallbackText={form.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 w-full space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-white/60
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-lime-400 file:text-black
                                    hover:file:bg-lime-300 transition
                                    cursor-pointer"
                            />
                            {uploading && <p className="text-xs text-lime-400 animate-pulse">Uploading to R2...</p>}
                            <input
                                name="image"
                                value={form.image}
                                onChange={handleChange}
                                placeholder="Or enter manual R2 key / URL"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                            />
                        </div>
                    </div>
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
                        {saving ? "Creating..." : "Create Prompt"}
                    </button>
                </div>
            </form>
        </div>
    );
}