const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

// Returns { distance (metres), duration (seconds), path: [[lat, lon], ...] }.
export async function fetchRoute(from, to, signal) {
  const coords = [from, to].map(([lat, lon]) => `${lon},${lat}`).join(";");
  const response = await fetch(
    `${OSRM_URL}/${coords}?overview=full&geometries=geojson`,
    { signal }
  );
  if (!response.ok) {
    throw new Error(`Route service failed (${response.status})`);
  }
  const data = await response.json();
  const route = data.routes?.[0];
  if (data.code !== "Ok" || !route) {
    throw new Error("No driving route found between these locations.");
  }
  return {
    distance: route.distance,
    duration: route.duration,
    path: route.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
  };
}
