const place = (id, name, address, lat, lon) => ({
  id,
  name,
  address,
  label: `${name}, ${address}`,
  position: [lat, lon],
});

export const POPULAR_ROUTES = [
  {
    from: place("popular-mumbai", "Mumbai", "Maharashtra, India", 19.076, 72.8777),
    to: place("popular-pune", "Pune", "Maharashtra, India", 18.5204, 73.8567),
  },
  {
    from: place("popular-delhi", "New Delhi", "Delhi, India", 28.6139, 77.209),
    to: place("popular-agra", "Agra", "Uttar Pradesh, India", 27.1767, 78.0081),
  },
  {
    from: place("popular-bengaluru", "Bengaluru", "Karnataka, India", 12.9716, 77.5946),
    to: place("popular-mysuru", "Mysuru", "Karnataka, India", 12.2958, 76.6394),
  },
  {
    from: place("popular-chennai", "Chennai", "Tamil Nadu, India", 13.0827, 80.2707),
    to: place("popular-puducherry", "Puducherry", "Puducherry, India", 11.9416, 79.8083),
  },
];
