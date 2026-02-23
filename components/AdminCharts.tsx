"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AdminChartsProps {
    userGrowth: { date: string; count: number }[];
    promptTrend: { date: string; count: number }[];
}

export default function AdminCharts({ userGrowth, promptTrend }: AdminChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Growth Chart */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6">User Growth (Last 30 Days)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={userGrowth}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="rgba(255,255,255,0.5)"
                                fontSize={12}
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                minTickGap={30}
                            />
                            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Prompt Creation Chart */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6">New Prompts (Last 30 Days)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={promptTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="rgba(255,255,255,0.5)"
                                fontSize={12}
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                minTickGap={30}
                            />
                            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="count" fill="#a3e635" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
