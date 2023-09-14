"use client";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
const provider = new OpenStreetMapProvider();

const LeafletAutoComplete = async (inputOne) => {
        const results = await provider.search({ query: inputOne });
        return results;
}

export default LeafletAutoComplete;