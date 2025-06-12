import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sport, distance, terrain, start, roundTrip, direction } = req.body;
  let profile = "foot-hiking";
  if (sport === "Cycling") profile = "cycling-regular";
  if (sport === "Running") profile = "foot-running";

  const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;
  const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;

  let body: any = { coordinates: [start] };
  if (roundTrip) {
    // Use direction as initial heading for round trip
    body.options = {
      round_trip: {
        length: distance * 1000, // meters
        points: 3 + Math.floor(Math.random() * 3), // 3-5 points for variety
        seed: Math.floor(Math.random() * 100000),
        ...(typeof direction === "number" && {
          initial_heading: direction, // OpenRouteService supports this option
        }),
      },
    };
  } else {
    // One-way: calculate destination using direction (bearing)
    const bearing =
      typeof direction === "number" ? direction : Math.random() * 360;
    const R = 6371; // Earth radius in km
    const d = distance; // full distance for one-way
    const lat1 = (start[1] * Math.PI) / 180;
    const lon1 = (start[0] * Math.PI) / 180;
    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(d / R) +
        Math.cos(lat1) * Math.sin(d / R) * Math.cos((bearing * Math.PI) / 180)
    );
    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin((bearing * Math.PI) / 180) * Math.sin(d / R) * Math.cos(lat1),
        Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2)
      );
    const dest = [(lon2 * 180) / Math.PI, (lat2 * 180) / Math.PI];
    body.coordinates = [start, dest];
  }

  try {
    const orsRes = await axios.post(url, body, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });
    res.status(200).json(orsRes.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
