import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
});

const MapRouting = ({position1, position2}, props) => {
    const map = useMap();
    let routingControl;
    useEffect(() => {
      if (!map) return;
      routingControl = L.Routing.control({
        waypoints: [L.latLng(position1[0], position1[1]), L.latLng(position2[0], position2[1])],
        routeWhileDragging: true
      }).addTo(map);
      
      return () => map.removeControl(routingControl);
    }, [map]);
  
    return null;
}

export default MapRouting;
