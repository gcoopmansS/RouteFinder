import axios from "axios";

export type RoutePreferences = {
  sport: string;
  distance: number; // in km
  terrain: string;
  start: [number, number]; // [lon, lat]
  roundTrip?: boolean; // enforce round trip
  direction?: number; // bearing in degrees (optional)
};

export async function generateRoute(preferences: RoutePreferences) {
  // Call our own Next.js API route instead of ORS directly
  const response = await axios.post("/api/route", preferences);
  return response.data;
}
