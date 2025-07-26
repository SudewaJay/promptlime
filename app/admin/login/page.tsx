'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      localStorage.setItem('admin-auth', 'true');
      router.push('/admin');
    } else {
      alert('Wrong password');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-40">
      <h1 className="text-xl font-semibold">🔐 Admin Login</h1>
      <input
        type="password"
        placeholder="Enter admin password"
        className="bg-white/10 px-4 py-2 rounded-md border border-white/20"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-lime-400 text-black py-2 px-4 rounded">
        Login
      </button>
    </div>
  );
}