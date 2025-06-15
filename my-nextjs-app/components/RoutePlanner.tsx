import React, { useState, useEffect } from "react";
import { generateRoute } from "../utils/routeGenerator";
import dynamic from "next/dynamic";
import RouteConfigPanel from "./RouteConfigPanel";
import styles from "../styles/RoutePlanner.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const RouteMap = dynamic(() => import("./RouteMap"), { ssr: false });

// Sport icons as separate React components for easy replacement
const CyclingIcon = () => (
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
);
const RunningIcon = () => (
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
);

const sportOptions = [
  {
    label: "Cycling",
    value: "Cycling",
    icon: <CyclingIcon />,
  },
  {
    label: "Running",
    value: "Running",
    icon: <RunningIcon />,
  },
];

// Terrain icons as separate React components for easy replacement
const FlatIcon = () => (
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="#14b8a6"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="16" width="18" height="4" rx="2" />
    <rect x="7" y="12" width="10" height="4" rx="2" />
  </svg>
);
const HillsIcon = () => (
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="#14b8a6"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polyline points="3 20 10 10 14 14 21 6" />
    <circle cx="21" cy="6" r="1.5" fill="#14b8a6" />
  </svg>
);
const MixedIcon = () => (
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="#14b8a6"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="16" width="6" height="4" rx="2" />
    <rect x="9" y="12" width="6" height="8" rx="2" />
    <rect x="15" y="8" width="6" height="12" rx="2" />
  </svg>
);

const terrainOptions = [
  {
    label: "Flat & Fast",
    value: "Flat",
    icon: <FlatIcon />,
  },
  {
    label: "Hills & Climbs",
    value: "Hilly",
    icon: <HillsIcon />,
  },
  {
    label: "Mixed Terrain",
    value: "Mixed",
    icon: <MixedIcon />,
  },
];

const minDistance = 5;
const maxDistance = 100;

const CompassDirectionSelector: React.FC<{
  direction: number;
  setDirection: (dir: number) => void;
}> = ({ direction, setDirection }) => {
  const size = 90;
  const center = size / 2;
  const radius = 36;
  const pointerLength = 28;
  const [dragging, setDragging] = React.useState(false);

  // Calculate pointer position
  const angleRad = ((direction - 90) * Math.PI) / 180;
  const pointerX = center + pointerLength * Math.cos(angleRad);
  const pointerY = center + pointerLength * Math.sin(angleRad);

  // Helper to get angle from mouse/touch event
  const getAngleFromEvent = (
    clientX: number,
    clientY: number,
    svg: SVGSVGElement
  ) => {
    const rect = svg.getBoundingClientRect();
    const x = clientX - rect.left - center;
    const y = clientY - rect.top - center;
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return Math.round(angle);
  };

  // Mouse/touch event handlers
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    let clientX, clientY;
    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const svg = (e.target as SVGSVGElement).closest("svg") as SVGSVGElement;
    if (svg && clientX !== undefined && clientY !== undefined) {
      setDirection(getAngleFromEvent(clientX, clientY, svg));
    }
    e.preventDefault();
  };

  React.useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      const svg = document.getElementById(
        "compass-svg"
      ) as SVGSVGElement | null;
      if (svg && clientX !== undefined && clientY !== undefined) {
        setDirection(getAngleFromEvent(clientX, clientY, svg));
      }
    };
    const handleUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [dragging, setDirection]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "12px 0",
      }}
    >
      <svg
        id="compass-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          cursor: dragging ? "grabbing" : "pointer",
          background: "#f8fafc",
          borderRadius: "50%",
          boxShadow: "0 1px 6px #e0e7ef",
        }}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="#fff"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
        {/* N/E/S/W labels */}
        <text
          x={center}
          y={18}
          textAnchor="middle"
          fontSize="13"
          fill="#64748b"
        >
          N
        </text>
        <text
          x={center + radius - 6}
          y={center + 4}
          textAnchor="middle"
          fontSize="13"
          fill="#64748b"
        >
          E
        </text>
        <text
          x={center}
          y={size - 10}
          textAnchor="middle"
          fontSize="13"
          fill="#64748b"
        >
          S
        </text>
        <text
          x={center - radius + 6}
          y={center + 4}
          textAnchor="middle"
          fontSize="13"
          fill="#64748b"
        >
          W
        </text>
        {/* Pointer */}
        <line
          x1={center}
          y1={center}
          x2={pointerX}
          y2={pointerY}
          stroke="#14b8a6"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx={pointerX} cy={pointerY} r={5} fill="#14b8a6" />
      </svg>
    </div>
  );
};

function RoutePlanner({
  sidebarCollapsed,
  setSidebarCollapsed,
}: {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}) {
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

  // Track window height for SSR-safe rendering
  const [windowHeight, setWindowHeight] = useState(600);
  useEffect(() => {
    const updateHeight = () => setWindowHeight(window.innerHeight);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

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
    <div className={styles.routePlannerRoot}>
      <div
        className={styles.configPanel}
        style={{
          width: sidebarCollapsed ? 0 : 420,
          minWidth: sidebarCollapsed ? 0 : 420,
          maxWidth: sidebarCollapsed ? 0 : 420,
          overflow: sidebarCollapsed ? "hidden" : "auto",
          padding: sidebarCollapsed ? 0 : 32,
          transition:
            "width 0.2s, min-width 0.2s, max-width 0.2s, overflow 0.2s",
        }}
      >
        {!sidebarCollapsed && (
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
            CompassDirectionSelector={CompassDirectionSelector}
          />
        )}
      </div>
      <div className={styles.mapPanel}>
        <div className={styles.mapInner}>
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
            height={windowHeight}
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
}

export default RoutePlanner;
