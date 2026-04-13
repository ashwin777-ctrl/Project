'use client';

import { Item } from '@/types';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function ItemsMap({ items }: { items: Item[] }) {
  return (
    <MapContainer center={[20, 0]} zoom={2} className="h-[70vh] rounded-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
      {items.map((item) => (
        <Marker
          key={item._id}
          position={[item.location.coordinates[1], item.location.coordinates[0]]}
          icon={markerIcon}
        >
          <Popup>
            <strong>{item.title}</strong>
            <p>{item.status.toUpperCase()} • {item.category}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
