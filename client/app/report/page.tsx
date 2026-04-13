'use client';

import dynamic from 'next/dynamic';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

export default function ReportPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', category: 'other', status: 'lost' });
  const [lat, setLat] = useState(37.7749);
  const [lng, setLng] = useState(-122.4194);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append('latitude', String(lat));
    data.append('longitude', String(lng));
    if (image) data.append('image', image);

    try {
      await api.post('/items', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">Report Lost or Found Item</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        <input className="input" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {['electronics', 'documents', 'pets', 'accessories', 'other'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <textarea className="input min-h-28" placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        {['lost', 'found', 'claimed'].map((s) => <option key={s}>{s}</option>)}
      </select>
      <input type="file" accept="image/*" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          setImage(file);
          setPreview(URL.createObjectURL(file));
        }
      }} />
      {preview && <img src={preview} alt="preview" className="h-40 rounded-lg object-cover" />}
      <p className="text-sm text-slate-600">Click map to set location. Current: {lat.toFixed(4)}, {lng.toFixed(4)}</p>
      <MapPicker lat={lat} lng={lng} onPick={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />
      <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Submit Report'}</button>
    </form>
  );
}
