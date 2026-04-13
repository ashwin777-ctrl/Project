export type User = { id: string; name: string; email: string; role: 'user' | 'admin' };

export type Item = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'lost' | 'found' | 'claimed';
  imageUrl?: string;
  location: { type: 'Point'; coordinates: [number, number] };
  user: { _id: string; name: string; email: string };
  createdAt: string;
};

export type Message = {
  _id: string;
  content: string;
  item: { title: string; status: string };
  from: { name: string; email: string };
  to: { name: string; email: string };
  createdAt: string;
};
