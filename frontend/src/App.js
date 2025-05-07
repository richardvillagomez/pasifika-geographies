import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useMap } from 'react-leaflet';
import L from 'leaflet';

const App = () => {
  // const [data, setData] = useState(null);
  //const [island, setIsland] = useState('saipan');
  const [islandList, setIslandList] = useState([]); //dropdown options
  const [selectedIsland, setSelectedIsland] = useState('');
  const [data, setData] = useState(null); 
  const FitBounds = ({ geojson }) => {
    const map = useMap();
  
    useEffect(() => {
      if (geojson) {
        const layer = L.geoJSON(geojson);
        map.fitBounds(layer.getBounds());
      }
    }, [geojson, map]);
  
    return null;
  };
  

  /* useEffect(() => {
    fetch(`http://localhost:8000/api/layer/${island}/`)
      .then(res => res.json())
      .then(setData);
  }, [island]); */

  
  
  
  useEffect(() => {
    fetch('http://localhost:8000/api/layers', {
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
      setIslandList(data.layers); 
      setSelectedIsland(data.layers[0]);

  }); 
}, []); 

useEffect(() => {
  if (selectedIsland) {
    fetch(`http://localhost:8000/api/layer/${selectedIsland}/`, {
      mode: 'cors'
    })
      .then(res => res.json())
      .then(setData);
  }
}, [selectedIsland]);

const onEachFeature = (feature, layer) => {
  const name = feature.properties?.Name_USGSO || "Unknown";
  layer.bindPopup(`<strong>${name}</strong>`);
  
  layer.on({
    click: () => {
      console.log("Clicked feature:", feature);
      layer.openPopup();  // ensure it opens popup on click
    },
  });
};

  


return (
  <div>
    <h1>Pacific Islands GIS</h1>
    <select onChange={e => setSelectedIsland(e.target.value)} value={selectedIsland}>
      {islandList.map(island => (
        <option key={island} value={island}>{island}</option>
      ))}
    </select>
    <a href={`http://localhost:8000/api/layer/${selectedIsland}/`} download>
      Download GeoJSON
    </a>
    <MapContainer center={[15.2, 145.75]} zoom={8} style={{ height: '600px', width: '100%' }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {data && <GeoJSON data={data} onEachFeature={onEachFeature} />}
  {data && <FitBounds geojson={data} />}
</MapContainer>
  </div>
);
};


export default App;