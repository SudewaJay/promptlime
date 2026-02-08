// app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import Link from "next/link";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // ✅ Redirect to sign-in if not logged in
  if (!session?.user) redirect("/signin");

  // Optional: Check if user isPro or has admin privileges
  // if (!session.user.isPro) redirect("/unauthorized");

  return (
    <div className="flex min-h-screen text-white">
      <aside className="w-64 bg-[#111] border-r border-white/10 p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2 flex flex-col">
          <Link href="/admin" className="block px-3 py-2 rounded-lg hover:bg-white/5 hover:text-lime-400 transition">Dashboard</Link>
          <Link href="/admin/users" className="block px-3 py-2 rounded-lg hover:bg-white/5 hover:text-lime-400 transition">Users</Link>
          <Link href="/admin/prompts" className="block px-3 py-2 rounded-lg hover:bg-white/5 hover:text-lime-400 transition">Prompts</Link>
          <Link href="/admin/tools" className="block px-3 py-2 rounded-lg hover:bg-white/5 hover:text-lime-400 transition">Tools</Link>
          <Link href="/admin/notifications" className="block px-3 py-2 rounded-lg hover:bg-white/5 hover:text-lime-400 transition">Notifications</Link>
          <Link href="/admin/reports" className="block px-3 py-2 rounded-lg hover:bg-white/5 hover:text-lime-400 transition">Reports</Link>
          <Link href="/" className="block px-3 py-2 mt-6 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition border-t border-white/10">Back to Site</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-[#0f0f0f] p-10">{children}</main>
    </div>
  );
}