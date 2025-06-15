import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface RouteMapProps {
  geojson?: any;
  center?: [number, number];
  markerPosition?: [number, number];
  onMapClick?: (e: any) => void;
  markerPopup?: string;
  height?: number;
  onGoToCurrentLocation?: () => void; // new prop
}

const RouteMap: React.FC<RouteMapProps> = ({
  geojson,
  center,
  markerPosition,
  onMapClick,
  markerPopup,
  height = 400,
  onGoToCurrentLocation,
}) => {
  const mapRef = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Fix marker icon issues in Leaflet (only once)
    const iconUrl =
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
    const iconRetinaUrl =
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
    const shadowUrl =
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
    L.Marker.prototype.options.icon = L.icon({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }, []);

  // For picking mode
  function MapClicker() {
    useMapEvents({
      click: onMapClick,
    });
    return null;
  }

  let latlngs: [number, number][] = [];
  if (geojson) {
    const coords =
      geojson.features?.[0]?.geometry?.coordinates ||
      geojson.geometry?.coordinates ||
      [];
    latlngs = coords.map((c: number[]) => [c[1], c[0]]);
  }
  const mapCenter = center || latlngs[0] || [50.8503, 4.3517];

  // Track previous center to force map recenter
  const prevCenter = useRef<[number, number] | null>(null);
  const [mapKey, setMapKey] = React.useState(0);
  useEffect(() => {
    if (
      center &&
      (!prevCenter.current ||
        prevCenter.current[0] !== center[0] ||
        prevCenter.current[1] !== center[1])
    ) {
      setMapKey((k) => k + 1);
      prevCenter.current = center;
    }
  }, [center]);

  return (
    <div ref={mapRef} style={{ position: "relative" }}>
      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={13}
        whenReady={() => {
          // Access the map instance via the ref if needed
          // Example: mapRef.current = ... (already set by react-leaflet internally)
        }}
        style={{
          height,
          width: "100%",
          marginTop: 24,
          borderRadius: 12,
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // @ts-ignore
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {onMapClick && <MapClicker />}
        {markerPosition && (
          <Marker position={markerPosition}>
            <Popup>{markerPopup || "Start location"}</Popup>
          </Marker>
        )}
        {latlngs.length > 0 && (
          <Polyline
            pathOptions={{ color: "#14b8a6", weight: 6 }}
            positions={latlngs}
          />
        )}
        {latlngs.length > 1 && (
          <Marker position={latlngs[latlngs.length - 1]}>
            <Popup>Finish</Popup>
          </Marker>
        )}
      </MapContainer>
      {onGoToCurrentLocation && (
        <button
          ref={buttonRef}
          type="button"
          aria-label="Go to current location"
          onClick={() => {
            onGoToCurrentLocation();
            // Always center map on marker after location is set
            setTimeout(() => {
              if (mapRef.current && markerPosition) {
                mapRef.current.setView(
                  markerPosition,
                  mapRef.current.getZoom()
                );
              }
            }, 200);
          }}
          style={{
            background: "#fff",
            border: "1.5px solid #cbd5e1",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            cursor: "pointer",
            transition: "border 0.15s, box-shadow 0.15s",
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="6" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default RouteMap;
