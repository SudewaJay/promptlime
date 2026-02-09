"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Crown, User as UserIcon } from "lucide-react";
import Image from "next/image";

type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  isPro: boolean;
  copyCount?: number;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePro = async (userId: string) => {
    try {
      await fetch(`/api/users/${userId}/toggle-pro`, { method: "PATCH" });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isPro: !u.isPro } : u))
      );
    } catch (error) {
      console.error("Failed to toggle pro", error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-white/60 text-sm mt-1">
            Manage your user base, permissions, and subscriptions.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-lime-400 transition"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-xs uppercase text-white/50 tracking-wider">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Joined</th>
                <th className="p-4 font-semibold text-center">Copies</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-white/60">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-white/60">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                          {user.image ? (
                            <Image src={user.image} alt={user.name} width={40} height={40} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/40">
                              <UserIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name || "No Name"}</div>
                          <div className="text-sm text-white/60">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.isPro ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 border border-yellow-400/30">
                          <Crown size={12} /> PRO
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-white/60">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4 text-center text-sm font-medium text-white">
                      {user.copyCount || 0}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => togglePro(user._id)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition ${user.isPro
                          ? "border-white/20 text-white/70 hover:bg-white/10"
                          : "border-lime-400/30 text-lime-400 hover:bg-lime-400/10"
                          }`}
                      >
                        {user.isPro ? "Remove Pro" : "Gift Pro"}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-1.5 text-white/40 hover:text-red-400 transition"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}