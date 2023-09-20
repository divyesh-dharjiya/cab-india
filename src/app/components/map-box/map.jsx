"use client";
import React from 'react';
import { Circle, CircleMarker, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import MapRouting from './map-routing';

const MapComponent = ({ markerOne, markerTwo, onMarkerSelected }) => {
  let position;
  let position2;
  if (markerOne) {
    position = markerOne
  }
  if (markerTwo) {
    position2 = markerTwo
  }

  return (
    <div>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={false} style={{ height: '70vh' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          markerOne.length && (<Marker position={position} zoom={5}></Marker>)
        }
        {
          markerTwo.length && (<Marker position={position2} zoom={5}></Marker>)
        }
        {
          markerOne.length && markerTwo.length && (
            <MapRouting onMarkerSelected={onMarkerSelected} position1={position} position2={position2} zoom={10} />
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