/**
 * Maps Component
 *
 * Muestra un mapa interactivo con la ubicación del restaurante usando Leaflet.
 * Muestra un esqueleto de carga mientras se obtiene el mapa.
 *
 * Props:
 * @param {Array|string} geoLocation - Coordenadas de ubicación (lat, lon).
 * @param {string} restaurantName - Nombre del restaurante para el popup.
 *
 * Estado:
 * - isLoading: Estado de carga del mapa.
 *
 * Características:
 * - Muestra mapa con marcador y popup.
 * - Muestra esqueleto de carga mientras se carga el mapa.
 *
 * Ejemplo de uso:
 * <Maps geoLocation={location} restaurantName={name} />
 *
 * @module Maps
 */
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import { SkeletonMap } from './SkeletonsMainPage.jsx';

const Maps = ({ geoLocation, restaurantName }) => {
  const [isLoading, setIsLoading] = useState(true);
  let lat = 0;
  let lon = 0;
  if (
    Array.isArray(geoLocation) &&
    typeof geoLocation[0] === 'string' &&
    geoLocation[0].includes(',')
  ) {
    let geoLocationStr = geoLocation[0];
    let commaIndex = geoLocationStr.indexOf(',');
    lat = parseFloat(geoLocationStr.substring(0, commaIndex));
    lon = parseFloat(geoLocationStr.substring(commaIndex + 1));
  }

  if (!lat || !lon) {
    return <div className="text-center text-gray-500">Location not available</div>;
  }


  return (
    <>
      <div className="relative h-[400px] w-full">
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <SkeletonMap />
          </div>
        )}
        <MapContainer
          center={[lat, lon]}
          zoom={13}
          className="h-[400px] w-full"
          whenReady={() => setIsLoading(false)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[lat, lon]}>
            <Popup>{restaurantName}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
};

export default Maps;