'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const [u, i] = await Promise.all([api.get('/admin/users'), api.get('/admin/items')]);
    setUsers(u.data);
    setItems(i.data);
  };

  useEffect(() => { load(); }, []);

  const deleteUser = async (id: string) => {
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-white p-4 shadow">
        <h1 className="text-xl font-bold">Admin Users</h1>
        {users.map((u) => (
          <div key={u._id} className="mt-2 flex items-center justify-between rounded border p-2">
            <span>{u.name} ({u.email})</span>
            <button className="text-red-600" onClick={() => deleteUser(u._id)}>Delete</button>
          </div>
        ))}
      </section>
      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-xl font-bold">All Reports</h2>
        {items.map((item) => <p key={item._id} className="mt-2 rounded border p-2">{item.title} - {item.status}</p>)}
      </section>
    </div>
  );
}
