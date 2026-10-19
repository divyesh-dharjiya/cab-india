"use client";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DROP_COLOR, PICKUP_COLOR } from "../../lib/markers";

const INDIA_CENTER = [22.5, 79];
const INDIA_ZOOM = 5;

const pinIcon = (color, text) =>
  L.divIcon({
    className: "cab-marker",
    html: `<span style="background:${color}"><b>${text}</b></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 36],
    popupAnchor: [0, -34],
  });

const pickupIcon = pinIcon(PICKUP_COLOR, "A");
const dropIcon = pinIcon(DROP_COLOR, "B");

// Keeps the viewport in sync with whatever is selected.
const ViewController = ({ from, to, path }) => {
  const map = useMap();

  useEffect(() => {
    if (path?.length) {
      map.fitBounds(L.latLngBounds(path), { padding: [40, 40] });
    } else if (from && to) {
      map.fitBounds(L.latLngBounds([from.position, to.position]), { padding: [60, 60] });
    } else if (from || to) {
      map.flyTo((from || to).position, 13, { duration: 0.8 });
    } else {
      map.setView(INDIA_CENTER, INDIA_ZOOM);
    }
  }, [map, from, to, path]);

  return null;
};

const MapComponent = ({ from, to, route }) => (
  <MapContainer
    center={INDIA_CENTER}
    zoom={INDIA_ZOOM}
    scrollWheelZoom
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {route && (
      <>
        <Polyline positions={route.path} pathOptions={{ color: "#1F2937", weight: 8, opacity: 0.25 }} />
        <Polyline positions={route.path} pathOptions={{ color: "#2563EB", weight: 5 }} />
      </>
    )}
    {from && (
      <Marker position={from.position} icon={pickupIcon}>
        <Popup><strong>Pickup</strong><br />{from.label}</Popup>
      </Marker>
    )}
    {to && (
      <Marker position={to.position} icon={dropIcon}>
        <Popup><strong>Drop</strong><br />{to.label}</Popup>
      </Marker>
    )}
    <ViewController from={from} to={to} path={route?.path} />
  </MapContainer>
);

export default MapComponent;
