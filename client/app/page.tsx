import Link from 'next/link';

export default function Home() {
  return (
    <section className="rounded-xl bg-white p-10 shadow">
      <h1 className="text-3xl font-bold">Lost and Found Management System</h1>
      <p className="mt-3 text-slate-600">Report lost/found items, explore nearby reports, and connect safely.</p>
      <div className="mt-5 flex gap-3">
        <Link href="/report" className="btn">Report Item</Link>
        <Link href="/map" className="rounded-lg border px-4 py-2">View Map</Link>
      </div>
    </section>
  );
}
