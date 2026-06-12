// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Users, ChartBar, Gear, SignOut } from '@phosphor-icons/react';

export default function Sidebar() {
  const pathname = usePathname();

  // A simple array of our navigation links
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Users },
    { name: 'Clients', href: '/clients', icon: ChartBar },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0C0D12] border-r border-white/5 flex flex-col justify-between hidden md:flex sticky top-0">
      
      {/* Top Section: Logo & Nav */}
      <div>
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3 text-white">
            <span className="font-bold tracking-wide text-lg">TDC</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2 mt-4">
          <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-4">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={20} weight={isActive ? "fill" : "regular"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}