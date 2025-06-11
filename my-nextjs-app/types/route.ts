export interface RouteSummary {
  distance: number; // meters
  duration: number; // seconds
  ascent?: number; // meters
  descent?: number; // meters
}

export interface RouteGeoJSON {
  type: string;
  features: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: number[][];
    };
    properties: {
      summary: RouteSummary;
      [key: string]: any;
    };
  }>;
}
