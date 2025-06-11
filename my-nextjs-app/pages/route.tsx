import React from "react";
import { useRouter } from "next/router";
import RouteMap from "../components/RouteMap";

const RoutePage: React.FC = () => {
  const router = useRouter();
  const { geojson, distance, duration, ascent, descent } = router.query;

  let routeGeojson = null;
  try {
    routeGeojson = geojson ? JSON.parse(geojson as string) : null;
  } catch {
    routeGeojson = null;
  }

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1>Your Generated Route</h1>
        <RouteMap geojson={routeGeojson} />
        <div style={{ marginTop: 24 }}>
          <h2>Route Properties</h2>
          <ul style={{ fontSize: "1.08em", color: "#334155" }}>
            {distance && (
              <li>
                <b>Distance:</b> {distance} km
              </li>
            )}
            {duration && (
              <li>
                <b>Estimated Duration:</b> {duration} min
              </li>
            )}
            {ascent && (
              <li>
                <b>Total Ascent:</b> {ascent} m
              </li>
            )}
            {descent && (
              <li>
                <b>Total Descent:</b> {descent} m
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoutePage;
