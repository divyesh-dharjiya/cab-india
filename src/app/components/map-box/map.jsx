"use client";
import React from 'react';
import { Circle, CircleMarker, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import L from "leaflet";


const MapComponent = ({ markerOne, markerTwo }) => {
  let position;
  let position2;
  if (markerOne) {
    position = markerOne
  }
  if (markerTwo) {
    position2 = markerTwo
  }
  if (markerOne.length && markerTwo.length) {
    createMarker(markerOne, markerTwo)
  }

  function createMarker(markerOne, markerTwo) {
    var markerFrom = L.circleMarker(markerOne, { color: "#F00", radius: 10 });
    var markerTo = L.circleMarker(markerTwo, { color: "#4AFF00", radius: 10 });
    var from = markerFrom.getLatLng();
    var to = markerTo.getLatLng();
    markerFrom.bindPopup('Delhi ' + (from).toString());
    markerTo.bindPopup('Mumbai ' + (to).toString());
    // map.addLayer(markerTo);
    // map.addLayer(markerFrom);
    getDistance(from, to);
  }

  function getDistance(from, to) {
    alert((from.distanceTo(to)).toFixed(0) / 1000) + ' km';
  }

  return (
    <div>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={false} style={{ height: '70vh' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          markerOne.length && (
            <Marker position={position} zoom={5}>
              <Popup>
              </Popup>
            </Marker>
          )
        }
        {
          markerTwo.length && (
            <Marker position={position2}>
              <Popup>
              </Popup>
            </Marker>
          )
        }
        <Circle center={[20.5937, 78.9629]} radius={1450000} />
        <CircleMarker center={[20.5937, 78.9629]}>
          <Popup>
            Select CAB only for india locations.
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  )
}

export default MapComponent;