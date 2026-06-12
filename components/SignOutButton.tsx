'use client';

import { signOut } from 'next-auth/react';
import { SignOut } from '@phosphor-icons/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="ml-4 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20"
    >
      <SignOut size={14} weight="bold" />
      Sign Out
    </button>
  );
}
