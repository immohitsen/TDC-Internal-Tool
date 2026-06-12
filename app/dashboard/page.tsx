'use client';

import { useState, useEffect } from 'react';
import type { Profile } from '@/types';
import { Users, UserPlus, PaperPlaneRight, ChartBar, Star, TrendUp } from '@phosphor-icons/react';
import Link from 'next/link';

export default function DashboardPage() {
    const [clients, setClients] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchClients() {
            try {
                const res = await fetch('/api/clients');
                if (res.ok) {
                    const data = await res.json();
                    setClients(data);
                }
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchClients();
    }, []);

    // Calculate Metrics
    const totalClients = clients.length;
    const newClients = clients.filter(c => c.status === 'New').length;
    const profileShared = clients.filter(c => c.status === 'Profile Shared').length;
    const introSent = clients.filter(c => c.status === 'Intro Sent').length;

    const recentClients = [...clients].reverse().slice(0, 3); // Just taking the last 3 for recent

    return (
        <div className="flex flex-col h-full overflow-y-auto pr-2">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Pipeline Overview</h1>
                <p className="text-zinc-400">Here is what is happening with your clients today.</p>
            </div>

            {isLoading ? (
                <div className="animate-pulse flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
                    </div>
                    <div className="h-64 bg-white/5 rounded-2xl"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-8">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#13141A] border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users size={64} weight="duotone" className="text-indigo-500" />
                            </div>
                            <div className="flex items-center gap-3 text-indigo-400 mb-2">
                                <Users size={20} weight="fill" />
                                <span className="font-semibold text-sm tracking-wider uppercase">Total Network</span>
                            </div>
                            <div className="text-4xl font-bold text-white font-heading">{totalClients}</div>
                        </div>

                        <div className="bg-[#13141A] border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <UserPlus size={64} weight="duotone" className="text-rose-500" />
                            </div>
                            <div className="flex items-center gap-3 text-rose-400 mb-2">
                                <Star size={20} weight="fill" />
                                <span className="font-semibold text-sm tracking-wider uppercase">Fresh Profiles</span>
                            </div>
                            <div className="text-4xl font-bold text-white font-heading">{newClients}</div>
                        </div>

                        <div className="bg-[#13141A] border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ChartBar size={64} weight="duotone" className="text-yellow-500" />
                            </div>
                            <div className="flex items-center gap-3 text-yellow-400 mb-2">
                                <ChartBar size={20} weight="fill" />
                                <span className="font-semibold text-sm tracking-wider uppercase">Pending Feedback</span>
                            </div>
                            <div className="text-4xl font-bold text-white font-heading">{profileShared}</div>
                        </div>

                        <div className="bg-[#13141A] border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <PaperPlaneRight size={64} weight="duotone" className="text-emerald-500" />
                            </div>
                            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                <TrendUp size={20} weight="fill" />
                                <span className="font-semibold text-sm tracking-wider uppercase">Active Intros</span>
                            </div>
                            <div className="text-4xl font-bold text-white font-heading">{introSent}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Funnel Chart Container */}
                        <div className="lg:col-span-2 bg-[#13141A] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 font-heading flex items-center gap-2">
                                Pipeline Funnel
                            </h3>

                            <div className="space-y-6">
                                {/* Stage 1: New */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-rose-400 font-medium">New / Unmatched</span>
                                        <span className="text-white font-bold">{newClients}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden relative">
                                        <div
                                            className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-full relative overflow-hidden"
                                            style={{ width: `${totalClients > 0 ? (newClients / totalClients) * 100 : 0}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" style={{ clipPath: 'polygon(0 0, 5px 0, 15px 100%, 10px 100%)' }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stage 2: Profile Shared */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-yellow-400 font-medium">Profile Shared (Awaiting Feedback)</span>
                                        <span className="text-white font-bold">{profileShared}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full"
                                            style={{ width: `${totalClients > 0 ? (profileShared / totalClients) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Stage 3: Intro Sent */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-emerald-400 font-medium">Mutual Intro Sent</span>
                                        <span className="text-white font-bold">{introSent}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full"
                                            style={{ width: `${totalClients > 0 ? (introSent / totalClients) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#13141A] border border-white/5 rounded-2xl p-6 flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-6 font-heading">Recently Added</h3>

                            <div className="flex-1 flex flex-col gap-4">
                                {recentClients.map(client => (
                                    <div key={client.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                                        <img src={client.photos[0]} alt={client.firstName} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate font-heading">{client.firstName} {client.lastName}</p>
                                            <p className="text-xs text-zinc-500 truncate">{client.city}, {client.age} yrs</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/clients"
                                className="mt-4 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                View All Clients
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
      `}</style>
        </div>
    );
}