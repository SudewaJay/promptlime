// app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

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
        <nav className="space-y-2">
          <a href="/admin/prompts" className="block hover:text-lime-400">Prompts</a>
          <a href="/admin/categories" className="block hover:text-lime-400">Categories</a>
          <a href="/admin/users" className="block hover:text-lime-400">Users</a>
        </nav>
      </aside>
      <main className="flex-1 bg-[#0f0f0f] p-10">{children}</main>
    </div>
  );
}