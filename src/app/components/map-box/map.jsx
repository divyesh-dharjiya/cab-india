"use client";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DROP_COLOR, PICKUP_COLOR } from "../../lib/markers";

const INDIA_BOUNDS = [[8, 68.5], [35.5, 97]];
const EDGE_PADDING = 48;

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

// Keeps the viewport on whatever is selected, leaving `insetLeft` pixels free for the panel.
const ViewController = ({ from, to, path, insetLeft }) => {
  const map = useMap();

  useEffect(() => {
    const points = path?.length ? path : [from, to].filter(Boolean).map((place) => place.position);
    const bounds = points.length ? L.latLngBounds(points) : L.latLngBounds(INDIA_BOUNDS);
    map.fitBounds(bounds, {
      paddingTopLeft: [insetLeft + EDGE_PADDING, EDGE_PADDING],
      paddingBottomRight: [EDGE_PADDING, EDGE_PADDING],
      maxZoom: points.length ? 14 : 5,
      animate: true,
    });
  }, [map, from, to, path, insetLeft]);

  return null;
};

const MapComponent = ({ from, to, route, insetLeft = 0 }) => (
  <MapContainer
    bounds={INDIA_BOUNDS}
    zoomControl={false}
    scrollWheelZoom={false}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <ZoomControl position="topright" />
    {route && (
      <>
        <Polyline positions={route.path} pathOptions={{ color: "#0B0F19", weight: 9, opacity: 0.2 }} />
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
    <ViewController from={from} to={to} path={route?.path} insetLeft={insetLeft} />
  </MapContainer>
);

export default MapComponent;
