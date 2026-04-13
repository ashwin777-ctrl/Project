'use client';

import dynamic from 'next/dynamic';
import { FormEvent, useEffect, useState } from 'react';
import api from '@/lib/api';
import { Item } from '@/types';

const ItemsMap = dynamic(() => import('@/components/ItemsMap'), { ssr: false });

export default function MapPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [radiusKm, setRadiusKm] = useState('5');
  const [contactMessage, setContactMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  const fetchItems = async () => {
    const { data } = await api.get('/items', { params: { keyword, category, lat, lng, radiusKm } });
    setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const search = async (e: FormEvent) => {
    e.preventDefault();
    await fetchItems();
  };

  const sendMessage = async () => {
    if (!selectedItem || !contactMessage) return;
    await api.post('/messages', { itemId: selectedItem, content: contactMessage });
    setContactMessage('');
    alert('Message sent');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={search} className="grid gap-3 rounded-xl bg-white p-4 shadow md:grid-cols-5">
        <input className="input" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Keyword" />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {['electronics', 'documents', 'pets', 'accessories', 'other'].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input className="input" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" />
        <input className="input" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" />
        <input className="input" value={radiusKm} onChange={(e) => setRadiusKm(e.target.value)} placeholder="Radius km" />
        <button className="btn md:col-span-5">Search</button>
      </form>

      <ItemsMap items={items} />

      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Contact Item Owner</h2>
        <select className="input" value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="">Select an item</option>
          {items.map((i) => <option key={i._id} value={i._id}>{i.title} ({i.status})</option>)}
        </select>
        <textarea className="input mt-2" placeholder="Write your message" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} />
        <button className="btn mt-2" onClick={sendMessage}>Send Message</button>
      </section>
    </div>
  );
}
