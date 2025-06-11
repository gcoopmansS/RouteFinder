import React, { useState, useEffect } from "react";
import { generateRoute } from "../utils/routeGenerator";
import dynamic from "next/dynamic";
import RouteConfigPanel from "./RouteConfigPanel";

const RouteMap = dynamic(() => import("./RouteMap"), { ssr: false });

const sportOptions = [
  {
    label: "Cycling",
    value: "Cycling",
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="5.5" cy="18.5" r="3.5" />
        <circle cx="18.5" cy="18.5" r="3.5" />
        <path d="M15 18.5V15a2 2 0 0 0-2-2h-2.5" />
        <path d="M6.5 18.5l4-7.5h3l2 3.5" />
        <circle cx="12" cy="7" r="2" />
      </svg>
    ),
  },
  {
    label: "Running",
    value: "Running",
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="13" cy="4" r="2" />
        <path d="M4 17l4-4 3 3 4-4 5 5" />
        <path d="M8 17v5" />
        <path d="M16 17v5" />
      </svg>
    ),
  },
];

const terrainOptions = [
  {
    label: "Flat & Fast",
    value: "Flat",
    desc: "Minimal elevation, smooth roads",
  },
  {
    label: "Hills & Climbs",
    value: "Hilly",
    desc: "Challenging elevation gains",
  },
  { label: "Mixed Terrain", value: "Mixed", desc: "Variety of elevations" },
];

const minDistance = 5;
const maxDistance = 100;

const RoutePlanner: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState("Cycling");
  const [distance, setDistance] = useState(20);
  const [selectedTerrain, setSelectedTerrain] = useState("Mixed");
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startLat, setStartLat] = useState<number | null>(null);
  const [startLng, setStartLng] = useState<number | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [direction, setDirection] = useState<number>(0);

  // Set current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStartLat(position.coords.latitude);
          setStartLng(position.coords.longitude);
          setUseCurrentLocation(true);
        },
        () => {
          // If denied, fallback to Brussels
          setStartLat(50.8503);
          setStartLng(4.3517);
        }
      );
    } else {
      setStartLat(50.8503);
      setStartLng(4.3517);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoute(null);
    try {
      if (startLat == null || startLng == null)
        throw new Error("No start location set");
      const start: [number, number] = [startLng, startLat];
      const data = await generateRoute({
        sport: selectedSport,
        distance,
        terrain: selectedTerrain,
        start,
        roundTrip: isRoundTrip,
        direction: isRoundTrip ? undefined : direction,
      });
      setRoute(data);
    } catch (err: any) {
      setError("Failed to generate route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStartLat(position.coords.latitude);
          setStartLng(position.coords.longitude);
          setUseCurrentLocation(true);
        },
        () => {
          alert(
            "Could not get your location. Please allow location access or pick on the map."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Keep map center in sync with marker
  const mapCenter: [number, number] = [startLat ?? 50.8503, startLng ?? 4.3517];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        minHeight: 600,
      }}
    >
      {/* Left: Configuration Controls */}
      <div
        style={{
          flex: "0 0 370px",
          minWidth: 320,
          maxWidth: 420,
          padding: "32px 32px 32px 0",
        }}
      >
        <RouteConfigPanel
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          distance={distance}
          setDistance={setDistance}
          minDistance={minDistance}
          maxDistance={maxDistance}
          selectedTerrain={selectedTerrain}
          setSelectedTerrain={setSelectedTerrain}
          isRoundTrip={isRoundTrip}
          setIsRoundTrip={setIsRoundTrip}
          direction={direction}
          setDirection={setDirection}
          loading={loading}
          error={error}
          handleSubmit={handleSubmit}
          sportOptions={sportOptions}
          terrainOptions={terrainOptions}
          route={route}
        />
      </div>
      {/* Vertical divider */}
      <div
        style={{
          width: 1,
          background: "#e5e7eb",
          minHeight: 600,
          margin: "0 32px",
        }}
      />
      {/* Right: Map only */}
      <div
        style={{
          flex: "1 1 700px",
          minWidth: 400,
          maxWidth: 900,
          padding: 32,
        }}
      >
        <div style={{ height: 520, width: "100%" }}>
          <RouteMap
            geojson={route}
            center={mapCenter}
            markerPosition={mapCenter}
            onMapClick={(e) => {
              setStartLat(e.latlng.lat);
              setStartLng(e.latlng.lng);
              setUseCurrentLocation(false);
            }}
            markerPopup={
              useCurrentLocation ? "Current location" : "Start location"
            }
            height={520}
            onGoToCurrentLocation={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setStartLat(position.coords.latitude);
                    setStartLng(position.coords.longitude);
                    setUseCurrentLocation(true);
                  },
                  () => {
                    alert(
                      "Could not get your location. Please allow location access or pick on the map."
                    );
                  }
                );
              } else {
                alert("Geolocation is not supported by your browser.");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
