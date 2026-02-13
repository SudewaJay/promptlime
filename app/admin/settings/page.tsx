"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function AdminSettings() {
    const [defaultTag, setDefaultTag] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings?key=defaultTag");
            const data = await res.json();
            if (data.value) {
                setDefaultTag(data.value);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "defaultTag", value: defaultTag }),
            });

            if (res.ok) {
                toast.success("Settings saved successfully!");
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Error saving settings", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Loading settings...</div>;

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-8 text-white">System Settings</h1>

            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10">
                <h2 className="text-xl font-semibold mb-4 text-white">Homepage Configuration</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Default Priority Tag
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        Prompts with this tag will be displayed at the top of the homepage feed.
                        Leave empty to disable.
                    </p>
                    <input
                        type="text"
                        value={defaultTag}
                        onChange={(e) => setDefaultTag(e.target.value)}
                        placeholder="e.g. valentines"
                        className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-lime-400 transition"
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-6 py-2 rounded-lg font-medium transition ${saving
                            ? "bg-lime-400/50 cursor-not-allowed text-black"
                            : "bg-lime-400 hover:bg-lime-500 text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                        }`}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
