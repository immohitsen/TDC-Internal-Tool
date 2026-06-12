// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Profile, MatchStatus } from '@/types';
import { CometCard } from "@/components/ui/comet-card";
import CustomerDetailedView from '@/components/CustomerDetailedView';
import { MagnifyingGlass, Funnel, GridFour, List, CaretDown } from '@phosphor-icons/react';

export default function ClientsPage() {
  const [clients, setClients] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Profile | null>(null);

  // New states for Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | MatchStatus>('All');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

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

  const updateClientStatus = async (clientId: string, newStatus: MatchStatus) => {
    // 1. Optimistic local update
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId ? { ...client, status: newStatus } : client
      )
    );

    // If the currently selected client is the one being updated, update it too
    if (selectedClient?.id === clientId) {
      setSelectedClient(prev => prev ? { ...prev, status: newStatus } : null);
    }

    // 2. Background sync
    try {
      await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error('Failed to update client status in database:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-red-600/90 text-white border-red-500/50';
      case 'Profile Shared': return 'bg-yellow-600/90 text-white border-yellow-500/50';
      case 'Active': return 'bg-blue-600/90 text-white border-blue-500/50';
      case 'Matched': return 'bg-emerald-600/90 text-white border-emerald-500/50';
      default: return 'bg-zinc-600/90 text-white border-zinc-500/50';
    }
  };

  // Filter clients based on search query and gender filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.city.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesGender = genderFilter === 'All' || client.gender === genderFilter;
    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
    
    return matchesSearch && matchesGender && matchesStatus;
  });

  return (
    <div className="relative">
      <div className="sticky top-0 z-40 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">

        {/* Search and Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search names or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#13141A] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 w-full sm:w-64 transition-all"
            />
          </div>

          {/* Gender Filter */}
          <div className="relative">
            <button
              onClick={() => setIsGenderOpen(!isGenderOpen)}
              className="flex items-center justify-between bg-[#13141A] border border-white/10 rounded-xl px-4 py-2 hover:bg-white/5 transition-colors focus:outline-none focus:border-rose-500/50 min-w-[150px]"
            >
              <div className="flex items-center">
                <Funnel className="text-zinc-500 mr-2" size={18} />
                <span className="text-sm text-white">
                  {genderFilter === 'All' ? 'All Genders' : genderFilter}
                </span>
              </div>
              <CaretDown className={`text-zinc-500 transition-transform ${isGenderOpen ? 'rotate-180' : ''}`} size={16} />
            </button>
            
            {isGenderOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsGenderOpen(false)} 
                />
                <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1b23] border border-white/10 rounded-xl shadow-2xl py-2 z-20 overflow-hidden">
                  {['All Genders', 'Male', 'Female'].map((option) => {
                    const value = option === 'All Genders' ? 'All' : option;
                    return (
                      <button
                        key={value}
                        onClick={() => {
                          setGenderFilter(value as any);
                          setIsGenderOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-rose-500/10 ${genderFilter === value ? 'text-rose-500 bg-rose-500/5' : 'text-zinc-300'}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="flex items-center justify-between bg-[#13141A] border border-white/10 rounded-xl px-4 py-2 hover:bg-white/5 transition-colors focus:outline-none focus:border-rose-500/50 min-w-[160px]"
            >
              <div className="flex items-center">
                <span className="text-sm text-white">
                  {statusFilter === 'All' ? 'All Statuses' : statusFilter}
                </span>
              </div>
              <CaretDown className={`text-zinc-500 transition-transform ml-2 ${isStatusOpen ? 'rotate-180' : ''}`} size={16} />
            </button>
            
            {isStatusOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsStatusOpen(false)} 
                />
                <div className="absolute top-full left-0 mt-2 w-full min-w-[160px] bg-[#1a1b23] border border-white/10 rounded-xl shadow-2xl py-2 z-20 overflow-hidden">
                  {['All Statuses', 'New', 'Profile Shared', 'Active', 'Matched'].map((option) => {
                    const value = option === 'All Statuses' ? 'All' : option;
                    return (
                      <button
                        key={value}
                        onClick={() => {
                          setStatusFilter(value as any);
                          setIsStatusOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-rose-500/10 ${statusFilter === value ? 'text-rose-500 bg-rose-500/5' : 'text-zinc-300'}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-[#13141A] border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              aria-label="Grid View"
            >
              <GridFour size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              aria-label="Table View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {isLoading ? (
            // Skeleton Loaders
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex w-full h-[320px] flex-col rounded-[16px] bg-[#13141A] p-3 animate-pulse">
                <div className="h-[240px] w-full bg-white/5 rounded-[12px]"></div>
                <div className="mt-3 space-y-2 px-2">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <CometCard key={client.id}>
                <button
                  type="button"
                  onClick={() => setSelectedClient(client)}
                  className="flex w-full h-[320px] cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#13141A] p-3 transition-colors hover:bg-white/5"
                  aria-label={`View profile of ${client.firstName}`}
                  style={{ transformStyle: "preserve-3d", transform: "none", opacity: 1 }}
                >
                  <div className="w-full">
                    <div className="relative h-[240px] w-full">
                      <Image
                        src={client.photos[0]}
                        alt={`${client.firstName}'s photo`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="absolute inset-0 rounded-[12px] bg-[#000000] object-cover"
                        style={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px 10px 15px -3px" }}
                      />
                      <div className="absolute inset-0 rounded-[12px] ring-1 ring-inset ring-white/10 pointer-events-none" />
                      <div className={`absolute top-2 left-2 z-10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border backdrop-blur-md ${getStatusColor(client.status)}`}>
                        {client.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex w-full flex-shrink-0 items-center justify-between px-2 text-white">
                    <div className="flex flex-col items-start text-left">
                      <div className="text-sm font-semibold tracking-tight font-heading">
                        {client.firstName}, {client.age}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5 font-sans">
                        {client.city}
                      </div>
                    </div>
                  </div>
                </button>
              </CometCard>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500">
              <MagnifyingGlass size={48} className="mb-4 opacity-50" />
              <p>No clients found matching your search.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#13141A] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-200px)]">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm text-zinc-300 relative">
              <thead className="text-xs uppercase bg-[#1A1C23] text-zinc-500 sticky top-0 z-20 shadow-sm before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:border-b before:border-white/5">
                <tr>
                  <th className="px-4 py-3 font-bold">Client</th>
                  <th className="px-4 py-3 font-bold">Location</th>
                  <th className="px-4 py-3 font-bold">Profession</th>
                  <th className="px-4 py-3 font-bold">Education</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5 animate-pulse">
                      <td className="px-4 py-2"><div className="h-4 w-32 bg-white/5 rounded-lg"></div></td>
                      <td className="px-4 py-2"><div className="h-4 w-20 bg-white/5 rounded"></div></td>
                      <td className="px-4 py-2"><div className="h-4 w-24 bg-white/5 rounded"></div></td>
                      <td className="px-4 py-2"><div className="h-4 w-24 bg-white/5 rounded"></div></td>
                      <td className="px-4 py-2"><div className="h-5 w-16 bg-white/5 rounded-full"></div></td>
                    </tr>
                  ))
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr 
                      key={client.id} 
                      onClick={() => setSelectedClient(client)}
                      className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-2">
                        <div className="font-bold text-white font-heading text-sm">{client.firstName} {client.lastName}</div>
                        <div className="text-[11px] text-zinc-500">{client.age} yrs • {client.gender} • {client.heightCm}cm</div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm text-white">{client.city}</div>
                        <div className="text-[11px] text-zinc-500">{client.country}</div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm text-white truncate max-w-[200px]">{client.designation}</div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[200px]">{client.company}</div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm text-white truncate max-w-[180px]">{client.degree}</div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[180px]">{client.ugCollege}</div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-zinc-500">
                      <MagnifyingGlass size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No clients found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedClient && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setSelectedClient(null)} />
          <div className="relative w-full max-w-6xl bg-[#0C0D12] h-full border-l border-white/10 p-8 pt-16 overflow-y-auto animate-[slideIn_0.3s_ease-out]">
            <button 
              onClick={() => setSelectedClient(null)} 
              className="absolute top-6 right-8 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors z-10"
            >
              ✕
            </button>
            <CustomerDetailedView profile={selectedClient} allClients={clients} onStatusUpdate={updateClientStatus} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}