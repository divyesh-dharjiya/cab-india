const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

const toPlace = (item) => {
  const [name, ...rest] = item.display_name.split(", ");
  return {
    id: String(item.place_id),
    name,
    address: rest.join(", "),
    label: item.display_name,
    position: [Number(item.lat), Number(item.lon)],
  };
};

// Search places inside India only. Pass an AbortSignal to cancel stale requests.
export async function searchPlaces(query, signal) {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    countrycodes: "in",
    limit: "6",
    "accept-language": "en",
  });
  const response = await fetch(`${NOMINATIM_URL}/search?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`Location search failed (${response.status})`);
  }
  const results = await response.json();
  return results.map(toPlace);
}

export async function reversePlace([lat, lon], signal) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: "jsonv2",
    "accept-language": "en",
  });
  const response = await fetch(`${NOMINATIM_URL}/reverse?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`Location lookup failed (${response.status})`);
  }
  const result = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }
  if (result.address?.country_code !== "in") {
    throw new Error("Your current location is outside India.");
  }
  return { ...toPlace(result), position: [lat, lon] };
}
