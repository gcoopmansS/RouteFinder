import React from "react";

interface RouteConfigPanelProps {
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  distance: number;
  setDistance: (distance: number) => void;
  minDistance: number;
  maxDistance: number;
  selectedTerrain: string;
  setSelectedTerrain: (terrain: string) => void;
  isRoundTrip: boolean;
  setIsRoundTrip: (isRound: boolean) => void;
  direction: number;
  setDirection: (dir: number) => void;
  loading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  sportOptions: any[];
  terrainOptions: any[];
  route: any;
  CompassDirectionSelector?: React.FC<{
    direction: number;
    setDirection: (dir: number) => void;
  }>;
}

const RouteConfigPanel: React.FC<
  RouteConfigPanelProps & {
    CompassDirectionSelector?: React.FC<{
      direction: number;
      setDirection: (dir: number) => void;
    }>;
  }
> = ({
  selectedSport,
  setSelectedSport,
  distance,
  setDistance,
  minDistance,
  maxDistance,
  selectedTerrain,
  setSelectedTerrain,
  isRoundTrip,
  setIsRoundTrip,
  direction,
  setDirection,
  loading,
  error,
  handleSubmit,
  sportOptions,
  terrainOptions,
  route,
  CompassDirectionSelector,
}) => (
  <div className="route-config-panel">
    <form
      id="route-config-form"
      onSubmit={handleSubmit}
      className="preferences-form"
    >
      <h2 style={{ marginBottom: 16 }}>Plan Your Route</h2>
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
          <div
            className={`terrain-btn${
              selectedTerrain === opt.value ? " selected" : ""
            }`}
            onClick={() => setSelectedTerrain(opt.value)}
            aria-pressed={selectedTerrain === opt.value}
            key={opt.value}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              {opt.icon}
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1.05em",
                  marginTop: 4,
                }}
              >
                {opt.label}
              </div>
            </div>
          </div>
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
      {CompassDirectionSelector ? (
        <CompassDirectionSelector
          direction={direction}
          setDirection={setDirection}
        />
      ) : null}
      {loading && (
        <div style={{ marginTop: 20, color: "#14b8a6" }}>
          Generating route...
        </div>
      )}
      {error && <div style={{ marginTop: 20, color: "#dc2626" }}>{error}</div>}
      <button
        type="submit"
        form="route-config-form"
        className="submit-btn"
        style={{
          width: "100%",
          fontSize: "1.1em",
          padding: "1em 0",
          borderRadius: 0,
        }}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Route"}
      </button>
    </form>
  </div>
);

export default RouteConfigPanel;
