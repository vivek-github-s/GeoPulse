import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../assets/location-pin.png';

const customIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [45, 45],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const MapFlyTo: React.FC<{ destination: LatLngExpression | null }> = ({ destination }) => {
  const map = useMap();
  useEffect(() => {
    if (destination) {
      map.flyTo(destination, 14);
    }
  }, [destination, map]);
  return null;
};

const SearchBar: React.FC<{
  onSearch: (from: string, to: string) => void;
}> = ({ onSearch }) => {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async (query: string, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: { q: query, format: 'json', limit: 5 }
        });
        const names = response.data.map((place: any) => place.display_name);
        setSuggestions(names);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions(fromQuery, setFromSuggestions);
  }, [fromQuery]);

  useEffect(() => {
    const fetchSuggestions = async (query: string, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: { q: query, format: 'json', limit: 5 }
        });
        const names = response.data.map((place: any) => place.display_name);
        setSuggestions(names);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions(toQuery, setToSuggestions);
  }, [toQuery]);

  const handleSubmit = () => {
    if (!fromQuery || !toQuery) {
      alert('Please enter both start and destination.');
      return;
    }
    onSearch(fromQuery, toQuery);
  };

  return (
    <div style={{
      position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 1000, background: '#fff', padding: '12px', borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)', display: 'flex', gap: '10px', alignItems: 'center'
    }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Choose starting point"
          value={fromQuery}
          onChange={(e) => setFromQuery(e.target.value)}
          style={{
            width: '200px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '8px',
            outline: 'none'
          }}
        />
        {fromSuggestions.length > 0 && (
          <ul style={{
            listStyle: 'none', margin: 0, padding: '5px', position: 'absolute',
            top: '100%', left: 0, width: '100%', background: '#fff', border: '1px solid #ccc',
            borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', zIndex: 1001
          }}>
            {fromSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setFromQuery(suggestion);
                  setFromSuggestions([]);
                }}
                style={{ padding: '6px 8px', cursor: 'pointer' }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Choose destination"
          value={toQuery}
          onChange={(e) => setToQuery(e.target.value)}
          style={{
            width: '200px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '8px',
            outline: 'none'
          }}
        />
        {toSuggestions.length > 0 && (
          <ul style={{
            listStyle: 'none', margin: 0, padding: '5px', position: 'absolute',
            top: '100%', left: 0, width: '100%', background: '#fff', border: '1px solid #ccc',
            borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', zIndex: 1001
          }}>
            {toSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setToQuery(suggestion);
                  setToSuggestions([]);
                }}
                style={{ padding: '6px 8px', cursor: 'pointer' }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          background: '#1a73e8', color: '#fff', border: 'none',
          borderRadius: '8px', padding: '8px 16px', cursor: 'pointer'
        }}
      >
        Get Directions
      </button>
    </div>
  );
};

const Map: React.FC = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [destination, setDestination] = useState<LatLngExpression | null>(null);
  const [directions, setDirections] = useState<LatLngExpression[] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number, duration: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      () => {
        setPosition([28.6139, 77.2090]); // Delhi fallback
      }
    );
  }, []);

  const geocode = async (query: string): Promise<LatLngExpression> => {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: { q: query, format: 'json', limit: 1 }
    });
    if (response.data.length === 0) {
      throw new Error(`Location not found: ${query}`);
    }
    const { lat, lon } = response.data[0];
    return [parseFloat(lat), parseFloat(lon)];
  };

  const getDirections = async (fromText: string, toText: string) => {
    try {
      const fromCoords = await geocode(fromText) as [number, number];
      const toCoords = await geocode(toText) as [number, number];

      const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=full&geometries=geojson`;

      const res = await axios.get(url);
      const route = res.data.routes[0];

      const coords = route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as LatLngExpression
      );

      setDirections(coords);
      setPosition(fromCoords);
      setDestination(toCoords);
      setRouteInfo({
        distance: route.distance / 1000,
        duration: route.duration / 60
      });
    } catch (err) {
      alert('Failed to find directions: ' + (err as Error).message);
    }
  };

  return (
    <>
      <SearchBar onSearch={getDirections} />
      {routeInfo && (
        <div style={{
          position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          background: '#fff', padding: '12px 20px', borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)', zIndex: 1000
        }}>
          <div><strong>Distance:</strong> {routeInfo.distance.toFixed(2)} km</div>
          <div><strong>Duration:</strong> {Math.round(routeInfo.duration)} mins</div>
        </div>
      )}

      {position ? (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} icon={customIcon}>
            <Popup>Starting Point</Popup>
          </Marker>
          {destination && (
            <Marker position={destination} icon={customIcon}>
              <Popup>Destination</Popup>
            </Marker>
          )}
          {directions && <Polyline positions={directions} color="blue" />}
          <MapFlyTo destination={destination} />
        </MapContainer>
      ) : (
        <p>Fetching your location...</p>
      )}
    </>
  );
};

export default Map;
