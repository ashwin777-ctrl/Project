'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setAuth(data.token, data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-3 rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">Register</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
      <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input className="input" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button className="btn w-full">Create Account</button>
    </form>
  );
}
