'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '@/lib/api';
import { Item, Message } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notification, setNotification] = useState('');

  const fetchAll = async () => {
    const [itemsRes, msgRes] = await Promise.all([api.get('/items/mine'), api.get('/messages')]);
    setItems(itemsRes.data);
    setMessages(msgRes.data);
  };

  useEffect(() => {
    if (!user) return;
    fetchAll();
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '');
    socket.emit('join', user.id);
    socket.on('match-found', () => setNotification('A potential match was found for one of your items.'));
    socket.on('new-message', () => setNotification('You received a new message.'));
    return () => socket.disconnect();
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/items/${id}`, { status });
    fetchAll();
  };

  const editItem = async (item: Item) => {
    const title = window.prompt('New title', item.title);
    if (!title) return;
    const description = window.prompt('New description', item.description);
    if (!description) return;
    await api.put(`/items/${item._id}`, { title, description });
    fetchAll();
  };

  const deleteItem = async (id: string) => {
    await api.delete(`/items/${id}`);
    fetchAll();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow"><p className="text-sm text-slate-500">Total Reports</p><h3 className="text-2xl font-bold">{items.length}</h3></div>
        <div className="rounded-xl bg-white p-4 shadow"><p className="text-sm text-slate-500">Lost</p><h3 className="text-2xl font-bold">{items.filter((i) => i.status === 'lost').length}</h3></div>
        <div className="rounded-xl bg-white p-4 shadow"><p className="text-sm text-slate-500">Found</p><h3 className="text-2xl font-bold">{items.filter((i) => i.status === 'found').length}</h3></div>
      </div>
      {notification && <div className="rounded-lg bg-emerald-100 p-3 text-emerald-900">{notification}</div>}
      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-xl font-semibold">My Reports</h2>
        <div className="mt-4 grid gap-3">
          {items.map((item) => (
            <div key={item._id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                <div className="flex gap-2 text-sm"><button onClick={() => editItem(item)} className="text-blue-600">Edit</button><button onClick={() => deleteItem(item._id)} className="text-red-600">Delete</button></div>
              </div>
              <div className="mt-2 flex gap-2">
                {['lost', 'found', 'claimed'].map((status) => (
                  <button key={status} onClick={() => updateStatus(item._id, status)} className={`rounded border px-2 py-1 text-xs ${item.status === status ? 'bg-blue-600 text-white' : ''}`}>{status}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-xl font-semibold">Messages</h2>
        <div className="mt-3 space-y-2">
          {messages.map((m) => <p key={m._id} className="rounded border p-2 text-sm"><strong>{m.from.name}</strong>: {m.content} (Item: {m.item.title})</p>)}
        </div>
      </section>
    </div>
  );
}
