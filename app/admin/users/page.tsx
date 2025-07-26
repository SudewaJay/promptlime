// app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  isPro: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users);
    }
    fetchUsers();
  }, []);

  const togglePro = async (userId: string) => {
    await fetch(`/api/users/${userId}/toggle-pro`, { method: "PATCH" });
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, isPro: !u.isPro } : u
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <table className="w-full border border-white/10 text-left">
        <thead>
          <tr className="bg-white/5 text-sm text-white/70">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Pro</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t border-white/10">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.isPro ? "✅" : "❌"}</td>
              <td className="p-2">
                <button
                  onClick={() => togglePro(user._id)}
                  className="text-sm bg-lime-500 text-black px-3 py-1 rounded"
                >
                  Toggle Pro
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}