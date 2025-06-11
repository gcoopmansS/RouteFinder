import React, { useState, useEffect } from "react";
import { generateRoute } from "../utils/routeGenerator";
import dynamic from "next/dynamic";

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
    <div className="landing-card">
      <h1>Discover Your Perfect Route</h1>
      <p>
        Get a personalized cycling or running route with real maps and
        turn-by-turn directions
      </p>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <button
            type="button"
            className="submit-btn"
            style={{
              padding: "0.4rem 1.2rem",
              width: "auto",
              fontSize: "1em",
              margin: 0,
            }}
            onClick={handleUseCurrentLocation}
          >
            Use My Location
          </button>
          <span style={{ color: "#64748b", fontSize: "0.98em" }}>
            or click on the map
          </span>
        </div>
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
          height={250}
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
      {route && (
        <div style={{ marginTop: 24 }}>
          <h2>Route Properties</h2>
          <ul style={{ fontSize: "1.08em", color: "#334155" }}>
            {route.features?.[0]?.properties?.summary?.distance && (
              <li>
                <b>Distance:</b>{" "}
                {(route.features[0].properties.summary.distance / 1000).toFixed(
                  2
                )}{" "}
                km
              </li>
            )}
            {route.features?.[0]?.properties?.summary?.duration && (
              <li>
                <b>Estimated Duration:</b>{" "}
                {Math.round(route.features[0].properties.summary.duration / 60)}{" "}
                min
              </li>
            )}
            {route.features?.[0]?.properties?.summary?.ascent && (
              <li>
                <b>Total Ascent:</b>{" "}
                {route.features[0].properties.summary.ascent} m
              </li>
            )}
            {route.features?.[0]?.properties?.summary?.descent && (
              <li>
                <b>Total Descent:</b>{" "}
                {route.features[0].properties.summary.descent} m
              </li>
            )}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} className="preferences-form">
        <label>What's your sport?</label>
        <div className="sport-options">
          {sportOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`sport-btn${
                selectedSport === opt.value ? " selected" : ""
              }`}
              onClick={() => setSelectedSport(opt.value)}
              aria-pressed={selectedSport === opt.value}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
        <label>How far do you want to go?</label>
        <div className="distance-row">
          <span className="distance-label">Short (5km)</span>
          <input
            type="range"
            min={minDistance}
            max={maxDistance}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
          />
          <span className="distance-value">{distance}km</span>
          <span className="distance-label">Epic (100km)</span>
        </div>
        <label>What terrain do you prefer?</label>
        <div className="terrain-options">
          {terrainOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`terrain-btn${
                selectedTerrain === opt.value ? " selected" : ""
              }`}
              onClick={() => setSelectedTerrain(opt.value)}
              aria-pressed={selectedTerrain === opt.value}
            >
              <div style={{ fontWeight: 700 }}>{opt.label}</div>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: "0.97em",
                  color: "#64748b",
                }}
              >
                {opt.desc}
              </div>
            </button>
          ))}
        </div>
        <label>Route Type</label>
        <div
          className="route-type-options"
          style={{ display: "flex", gap: 20, marginBottom: 24 }}
        >
          {[
            {
              label: "Round Trip",
              value: true,
              icon: (
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{ marginRight: 8 }}
                >
                  <path d="M17 17.5A6.5 6.5 0 1 1 12 5.5" />
                  <polyline points="17 14 17 17.5 13.5 17.5" />
                </svg>
              ),
            },
            {
              label: "One Way",
              value: false,
              icon: (
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{ marginRight: 8 }}
                >
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <polyline points="16 8 20 12 16 16" />
                </svg>
              ),
            },
          ].map((opt) => (
            <button
              type="button"
              key={opt.label}
              className={`route-type-btn${
                isRoundTrip === opt.value ? " selected" : ""
              }`}
              onClick={() => setIsRoundTrip(opt.value)}
              aria-pressed={isRoundTrip === opt.value}
              style={{
                padding: "1.1em 1.5em",
                borderRadius: 16,
                border: "2px solid #cbd5e1",
                background: isRoundTrip === opt.value ? "#ecfdf5" : "#f8fafc",
                color: isRoundTrip === opt.value ? "#14b8a6" : "#334155",
                fontWeight: 700,
                fontSize: "1.1em",
                marginBottom: 0,
                boxShadow:
                  isRoundTrip === opt.value ? "0 0 0 2px #14b8a6" : "none",
                transition: "all 0.15s",
                outline: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 140,
                justifyContent: "center",
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
        <label>Direction</label>
        <div
          className="direction-options"
          style={{ display: "flex", gap: 20, marginBottom: 24 }}
        >
          {[
            { label: "North", value: 0 },
            { label: "East", value: 90 },
            { label: "South", value: 180 },
            { label: "West", value: 270 },
          ].map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`direction-btn${
                direction === opt.value ? " selected" : ""
              }`}
              onClick={() => setDirection(opt.value)}
              aria-pressed={direction === opt.value}
              style={{
                padding: "1.1em 1.5em",
                borderRadius: 16,
                border: "2px solid #cbd5e1",
                background: direction === opt.value ? "#ecfdf5" : "#f8fafc",
                color: direction === opt.value ? "#14b8a6" : "#334155",
                fontWeight: 700,
                fontSize: "1.1em",
                marginBottom: 0,
                boxShadow:
                  direction === opt.value ? "0 0 0 2px #14b8a6" : "none",
                transition: "all 0.15s",
                outline: "none",
                minWidth: 100,
                justifyContent: "center",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {loading && (
          <div style={{ marginTop: 20, color: "#14b8a6" }}>
            Generating route...
          </div>
        )}
        {error && (
          <div style={{ marginTop: 20, color: "#dc2626" }}>{error}</div>
        )}
        <button
          type="submit"
          className="submit-btn"
          style={{
            marginTop: 12,
            width: "100%",
            fontSize: "1.1em",
            padding: "1em 0",
          }}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Route"}
        </button>
      </form>
    </div>
  );
};

export default RoutePlanner;
