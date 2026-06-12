import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ProfileDropdown from '@/components/ProfileDropdown';



export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log(session)

  if (!session) {
    redirect('/login');
  }

  const matchmakerName = session.user?.name || 'Matchmaker';
  const initials = matchmakerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#050507]">

      {/* 1. The Sticky Sidebar */}
      <Sidebar />

      {/* 2. The Main Content Area */}
      {/* flex-1 ensures it takes up all remaining space to the right of the sidebar */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Simple Topbar (For mobile menu or global search later) */}
        <header className="h-20 border-b border-white/5 bg-[#0C0D12]/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0 relative z-50">
          <h2 className="text-white font-medium">Dashboard</h2>

          {/* Matchmaker Avatar Dropdown */}
          <ProfileDropdown
            name={matchmakerName}
            email={session.user?.email || ''}
            initials={initials}
          />
        </header>

        {/* The Scrollable Page Content */}
        {/* "children" is where your page.tsx will be injected */}
        <div className="flex-1 overflow-hidden px-8 py-4 flex flex-col">
          {children}
        </div>
      </main>

    </div>
  );
}