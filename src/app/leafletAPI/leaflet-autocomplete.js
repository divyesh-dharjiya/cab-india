
const LeafletAutoComplete = async (inputOne) => {
        const results = await fetch(`https://nominatim.openstreetmap.org/search?q=${inputOne}&format=json`).then((response) => response.json());
        return results;
}

export default LeafletAutoComplete;