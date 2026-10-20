/**
 * GIS and geospatial calculations for ODISAR
 * Odisha Digital Inventory & Spatial Asset Registry
 * WGS84 coordinate helpers, polygon area calculation, and unit conversions
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Validates a GeoJSON Polygon object
 */
export function validateGeoJsonPolygon(geometry: any): { isValid: boolean; error?: string } {
  if (!geometry || typeof geometry !== 'object') {
    return { isValid: false, error: 'Geometry is missing or not an object' };
  }
  if (geometry.type !== 'Polygon') {
    return { isValid: false, error: `Expected type 'Polygon', got '${geometry.type}'` };
  }
  if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
    return { isValid: false, error: 'Coordinates array is empty or invalid' };
  }
  const ring = geometry.coordinates[0];
  if (!Array.isArray(ring) || ring.length < 4) {
    return { isValid: false, error: 'Polygon exterior ring must have at least 4 coordinates (closed loop)' };
  }
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (Math.abs(first[0] - last[0]) > 1e-6 || Math.abs(first[1] - last[1]) > 1e-6) {
    return { isValid: false, error: 'Polygon first and last coordinates must match to close the ring' };
  }
  for (const pt of ring) {
    if (!Array.isArray(pt) || pt.length < 2 || isNaN(pt[0]) || isNaN(pt[1])) {
      return { isValid: false, error: 'Invalid coordinate pair found' };
    }
    // GeoJSON is [longitude, latitude]
    if (pt[0] < -180 || pt[0] > 180 || pt[1] < -90 || pt[1] > 90) {
      return { isValid: false, error: 'Coordinates out of WGS84 bounds [-180..180, -90..90]' };
    }
  }
  return { isValid: true };
}

/**
 * Calculates estimated geodesic polygon area in square meters using spherical excess formula
 * Coordinates format: [lng, lat][]
 */
export function calculatePolygonAreaSqMeters(coordinates: [number, number][]): number {
  if (coordinates.length < 3) return 0;
  const radius = 6378137; // WGS84 Earth equatorial radius in meters
  let area = 0;
  const len = coordinates.length;

  for (let i = 0; i < len; i++) {
    const j = (i + 1) % len;
    const [p1Lng, p1Lat] = coordinates[i];
    const [p2Lng, p2Lat] = coordinates[j];

    const lat1Rad = (p1Lat * Math.PI) / 180;
    const lat2Rad = (p2Lat * Math.PI) / 180;
    const dLngRad = ((p2Lng - p1Lng) * Math.PI) / 180;

    area += dLngRad * (2 + Math.sin(lat1Rad) + Math.sin(lat2Rad));
  }

  area = Math.abs((area * radius * radius) / 2);
  return area;
}

/**
 * Converts area in square meters to Acres and Hectares
 */
export function sqMetersToUnits(sqMeters: number): { acres: number; hectares: number; sqYards: number } {
  const acres = sqMeters * 0.000247105;
  const hectares = sqMeters * 0.0001;
  const sqYards = sqMeters * 1.19599;
  return {
    acres: Number(acres.toFixed(3)),
    hectares: Number(hectares.toFixed(4)),
    sqYards: Number(sqYards.toFixed(1)),
  };
}

/**
 * Converts traditional Odisha revenue land measurement units into standard Acres
 * 1 Mana = 25 Guntha = 1 Acre (approx standard revenue settlement standard)
 * 1 Guntha = 4 Biswas = 1,742.4 sq ft = 0.04 Acre
 * 1 Bigha = 20 Biswas = 0.62 Acre (standard regional variation)
 */
export function convertTraditionalAreaToAcres(value: number, unit: string): number {
  const normalizedUnit = unit.trim().toLowerCase();
  switch (normalizedUnit) {
    case 'acre':
    case 'acres':
      return value;
    case 'guntha':
    case 'gunthas':
      return Number((value * 0.04).toFixed(3));
    case 'mana':
    case 'manas':
      return Number((value * 1.0).toFixed(3));
    case 'bigha':
    case 'bighas':
      return Number((value * 0.62).toFixed(3));
    case 'decimal':
    case 'decimals':
      return Number((value * 0.01).toFixed(3));
    case 'hectare':
    case 'hectares':
      return Number((value * 2.47105).toFixed(3));
    default:
      return value;
  }
}
