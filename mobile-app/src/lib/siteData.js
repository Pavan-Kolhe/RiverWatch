// Mock site data - In production, fetch from Appwrite
export const SITES = [
  {
    id: "CWC-WB-001",
    name: "IIIT PUNE",
    latitude: 18.76328,
    longitude: 73.6990708,
    maxDistance: 100,
  },
  {
    id: "CWC-DL-002",
    name: "Yamuna Bridge Delhi",
    latitude: 28.7041,
    longitude: 77.1025,
    maxDistance: 100,
  },
  {
    id: "CWC-KL-003",
    name: "Periyar River Station",
    latitude: 10.0261,
    longitude: 76.3125,
    maxDistance: 100,
  },
  {
    id: "CWC-WB-004",
    name: "Hooghly River Kolkata",
    latitude: 22.5726,
    longitude: 88.3639,
    maxDistance: 100,
  },
];

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Find nearest site
export function findNearestSite(userLat, userLon) {
  let nearest = null;
  let minDistance = Infinity;

  SITES.forEach((site) => {
    const distance = calculateDistance(
      userLat,
      userLon,
      site.latitude,
      site.longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...site, distance };
    }
  });

  return nearest;
}
