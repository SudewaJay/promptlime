"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

type Report = {
    _id: string;
    reason: string;
    status: string;
    createdAt: string;
    promptId: {
        _id: string;
        title: string;
        prompt: string;
    } | null;
    reporterId: {
        name: string;
        email: string;
    } | null;
};

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const res = await fetch("/api/reports");
            const data = await res.json();
            setReports(data.reports || []);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDismiss = async (reportId: string) => {
        try {
            await fetch("/api/reports", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId, status: "dismissed" }),
            });
            setReports((prev) => prev.filter((r) => r._id !== reportId));
        } catch (error) {
            console.error("Failed to dismiss report", error);
        }
    };

    const handleDeletePrompt = async (promptId: string, reportId: string) => {
        if (!confirm("Are you sure? This will delete the prompt permanently.")) return;

        try {
            // 1. Delete the prompt
            const res = await fetch(`/api/prompts/${promptId}`, { method: "DELETE" });

            if (res.ok) {
                // 2. Mark report as resolved
                await fetch("/api/reports", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reportId, status: "resolved" }),
                });
                setReports((prev) => prev.filter((r) => r._id !== reportId));
            } else {
                alert("Failed to delete prompt");
            }
        } catch (error) {
            console.error("Failed to delete prompt", error);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white">Reported Prompts</h1>

            {loading ? (
                <p className="text-white/60">Loading reports...</p>
            ) : reports.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                    <p className="text-white/60">No pending reports. Good job! 🎉</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div key={report._id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                                            {report.reason}
                                        </span>
                                        <span className="text-xs text-white/40">
                                            Reported by {report.reporterId?.name || "Unknown"} • {new Date(report.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {report.promptId ? (
                                        <>
                                            <h3 className="text-lg font-semibold text-white mb-1">
                                                {report.promptId.title}
                                            </h3>
                                            <p className="text-white/70 text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                                                {report.promptId.prompt}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-red-400 italic">Prompt has been deleted.</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    <button
                                        onClick={() => handleDismiss(report._id)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition text-sm"
                                    >
                                        <CheckCircle size={16} /> Dismiss
                                    </button>

                                    {report.promptId && (
                                        <button
                                            onClick={() => handleDeletePrompt(report.promptId!._id, report._id)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition text-sm"
                                        >
                                            <Trash2 size={16} /> Delete Prompt
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
