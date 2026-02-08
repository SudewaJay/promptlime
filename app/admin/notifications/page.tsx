"use client";

import { useState } from "react";
import { Send, Users, User, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
// import { useSession } from "next-auth/react";
// import Image from "next/image";

export default function AdminNotifications() {
    // const { data: session } = useSession();
    const [target, setTarget] = useState<"all" | "user">("all");
    const [userId, setUserId] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setSuccess(false);

        try {
            const res = await fetch("/api/admin/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    target,
                    userId: target === "user" ? userId : undefined,
                    title,
                    message,
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTitle("");
                setMessage("");
                setUserId("");
                setTimeout(() => setSuccess(false), 3000);
            } else {
                alert("Failed to send notification");
            }
        } catch (error) {
            console.error("Failed to send", error);
            alert("Error sending notification");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Push Notifications</h1>
                    <p className="text-gray-400">Send announcements or alerts to your users.</p>
                </div>
                <div className="bg-lime-400/10 p-3 rounded-full">
                    <Send className="text-lime-400" size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Form */}
                <div className="md:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6"
                    >
                        <form onSubmit={handleSend} className="space-y-6">
                            {/* Target Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">Target Audience</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setTarget("all")}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${target === "all"
                                            ? "bg-lime-400/20 border-lime-400 text-lime-400"
                                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                            }`}
                                    >
                                        <Users size={20} />
                                        <span className="font-medium">All Users</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTarget("user")}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${target === "user"
                                            ? "bg-lime-400/20 border-lime-400 text-lime-400"
                                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                            }`}
                                    >
                                        <User size={20} />
                                        <span className="font-medium">Specific User</span>
                                    </button>
                                </div>
                            </div>

                            {/* Specific User ID Input */}
                            {target === "user" && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="bg-white/5 p-4 rounded-xl border border-white/10"
                                >
                                    <label className="block text-xs font-medium text-gray-400 mb-1">User ID</label>
                                    <input
                                        type="text"
                                        value={userId}
                                        onChange={e => setUserId(e.target.value)}
                                        placeholder="e.g. 64f8a..."
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-lime-400 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Copy ID from Users Management page.</p>
                                </motion.div>
                            )}

                            {/* Content Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Notification Title"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-400 outline-none transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Type your message here..."
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-400 outline-none transition resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={sending || (target === "user" && !userId)}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${success
                                    ? "bg-green-500 text-white"
                                    : "bg-lime-400 text-black hover:bg-lime-300"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {sending ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> Sending...
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle2 size={20} /> Sent Successfully!
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} /> Send Notification
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Right: Preview / Tips */}
                <div className="space-y-6">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-4 relative overflow-hidden">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-lime-400/20 flex items-center justify-center shrink-0">
                                    <BellIcon />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{title || "Notification Title"}</h4>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                        {message || "This is how your message will appear to users in their notification list."}
                                    </p>
                                    <span className="text-[10px] text-gray-600 mt-2 block">Just now</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-xs text-gray-500 space-y-2">
                            <p>• <strong>Bulk</strong> notifications are sent to all registered users.</p>
                            <p>• <strong>Specific</strong> notifications target a single user by ID.</p>
                            <p>• Notifications are retained in database until user deletes account.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BellIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-400"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
    )
}
