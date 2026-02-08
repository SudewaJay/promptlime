"use client";

import { useEffect, useState } from "react";
import { Users, FileText, AlertTriangle, Heart, Copy } from "lucide-react";

interface AdminStats {
    userCount: number;
    promptCount: number;
    reportCount: number;
    totalLikes: number;
    totalCopies: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        userCount: 0,
        promptCount: 0,
        reportCount: 0,
        totalLikes: 0,
        totalCopies: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to load stats", error);
            }
        }
        fetchStats();
    }, []);

    const StatCard = ({
        title,
        value,
        icon: Icon,
        color,
    }: {
        title: string;
        value: number;
        icon: any;
        color: string;
    }) => (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition">
            <div className={`p-4 rounded-full ${color} bg-opacity-20`}>
                <Icon size={28} className={color.replace("bg-", "text-")} />
            </div>
            <div>
                <h3 className="text-white/60 text-sm font-medium">{title}</h3>
                <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-white/60">Welcome back, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.userCount}
                    icon={Users}
                    color="text-blue-400 bg-blue-400"
                />
                <StatCard
                    title="Total Prompts"
                    value={stats.promptCount}
                    icon={FileText}
                    color="text-lime-400 bg-lime-400"
                />
                <StatCard
                    title="Total Copies"
                    value={stats.totalCopies}
                    icon={Copy}
                    color="text-purple-400 bg-purple-400"
                />
                <StatCard
                    title="Total Likes"
                    value={stats.totalLikes}
                    icon={Heart}
                    color="text-red-400 bg-red-400"
                />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-yellow-500/20 rounded-full text-yellow-500 mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pending Reports</h3>
                <p className="text-white/60 mb-6">
                    There are <strong className="text-white">{stats.reportCount}</strong> prompts flagged by the community.
                </p>
                <a
                    href="/admin/reports"
                    className="inline-block px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition"
                >
                    Review Reports
                </a>
            </div>
        </div>
    );
}
