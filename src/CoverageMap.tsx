import React from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issues in React/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-expect-error - Leaflet icon internal property
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
});

interface CoverageMapProps {
  locationName?: string;
  zoom?: number;
}

const locationCoords: Record<string, [number, number]> = {
  "Luton": [51.8787, -0.4200],
  "Bedford": [52.1360, -0.4666],
  "Dunstable": [51.8860, -0.5210],
  "Milton Keynes": [52.0406, -0.7594],
  "St Albans": [51.7527, -0.3394],
  "Watford": [51.6565, -0.3903],
};

// Component to handle map center updates when location changes
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const CoverageMap: React.FC<CoverageMapProps> = ({ locationName, zoom = 11 }) => {
  const coords = locationName ? locationCoords[locationName] : null;

  if (!coords) {
    // Default to a wider view of the region if location not found
    const defaultCenter: [number, number] = [51.9, -0.5];
    return (
      <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-outline-variant/30 shadow-inner bg-surface-container-low relative z-0">
        <MapContainer 
          center={defaultCenter} 
          zoom={9} 
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Object.entries(locationCoords).map(([name, pos]) => (
            <Circle
              key={name}
              center={pos}
              pathOptions={{ color: 'var(--color-primary, #3b82f6)', fillColor: 'var(--color-primary, #3b82f6)', fillOpacity: 0.2 }}
              radius={5000}
            />
          ))}
        </MapContainer>
        <div className="absolute inset-0 pointer-events-none border-[12px] border-surface rounded-3xl z-10" />
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-outline-variant/30 shadow-inner bg-surface-container-low relative z-0">
      <MapContainer 
        center={coords} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <ChangeView center={coords} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={coords}
          pathOptions={{ 
            color: 'var(--color-primary, #3b82f6)', 
            fillColor: 'var(--color-primary, #3b82f6)', 
            fillOpacity: 0.2,
            weight: 2
          }}
          radius={8000} // 8km radius for coverage area
        />
      </MapContainer>
      {/* Decorative inner frame */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-surface rounded-3xl z-10" />
      
      {/* Legend / Overlay */}
      <div className="absolute bottom-6 left-6 z-20 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl border border-outline-variant/30 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs font-bold text-on-surface">Service Coverage: {locationName}</span>
        </div>
      </div>
    </div>
  );
};

export default CoverageMap;
