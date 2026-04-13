'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-blue-700">Lost & Found</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/map">Map</Link>
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/report">Report Item</Link>
              {user.role === 'admin' && <Link href="/admin">Admin</Link>}
              <button onClick={logout} className="btn">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
