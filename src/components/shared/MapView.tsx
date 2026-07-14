"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Workaround for Leaflet marker icon issues in SSR/Next.js environments
import L from "leaflet";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MarkerData {
  id: string;
  position: [number, number];
  title: string;
  description?: string;
}

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: MarkerData[];
  className?: string;
}

// Internal helper component to change map view programmatically when center coordinate changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function MapView({ center, zoom = 13, markers = [], className = "h-[450px] w-full rounded-2xl border shadow-sm overflow-hidden" }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted animate-pulse`}>
        <p className="text-sm text-muted-foreground font-medium">Initializing leaflet mapping components...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div className="text-left text-xs">
                <p className="font-bold text-sm text-primary">{marker.title}</p>
                {marker.description && <p className="text-muted-foreground mt-0.5">{marker.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
export default MapView;
