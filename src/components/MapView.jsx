import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Button from "./Button";
import { useCitiesProvider } from "../contexts/CitiesContext";
import { useUrlPosition } from "../hooks/useUrlPosition";
import styles from "./Map.module.css";

const MapView = () => {
  const { cities } = useCitiesProvider();
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const [isloadingLocation, setIsLoadingLocation] = useState(true);
  const [userLocation, setUserLocation] = useState([]);
  const [mapLat, mapLng] = useUrlPosition();
  const fetchUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoadingLocation(false);
          setMapPosition([position.coords.latitude, position.coords.longitude]);
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        () => {
          setIsLoadingLocation(false);
          alert("Pleaes Enable Your Location");
        },
      );
    } else {
      alert("Your Device Does Not Support Location");
    }
  };
  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([mapLat, mapLng]);
    } else {
      if (userLocation.length > 0) {
        setMapPosition(userLocation);
        return;
      }
      fetchUserLocation();
    }
  }, [mapLat, mapLng, userLocation]);
  // useEffect(() => {
  //   if (mapLat && mapLng) {
  //     setMapPosition([mapLat, mapLng]);
  //     return;
  //   }
  // }, [mapLat, mapLng]);

  return (
    <div className={styles.mapContainer}>
      {(userLocation[0] === mapPosition[0] &&
        userLocation[1] === mapPosition[1]) ||
      (mapLat && mapLng) ? (
        ""
      ) : (
        <Button btnType="position" onClick={fetchUserLocation}>
          {isloadingLocation ? "Loading" : "Use Your Location"}{" "}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            {city.notes ? <Popup>{city.notes}</Popup> : ""}
          </Marker>
        ))}
        <ChangeView position={mapPosition} />
        <SetViewOnClick setMapPosition={setMapPosition} />
        <LocationMarker userLocation={userLocation} />
        <LocationTracker setMapPosition={setMapPosition} />
      </MapContainer>
    </div>
  );
};
const ChangeView = ({ position }) => {
  const map = useMap();
  map.setView(position);
  return null;
};

const SetViewOnClick = () => {
  const navigate = useNavigate();
  useMapEvent("click", (e) => {
    navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
  });

  return null;
};

function LocationMarker({ userLocation }) {
  return userLocation.length === 0 ? null : (
    <Marker position={userLocation}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function LocationTracker({ setMapPosition }) {
  useMapEvents({
    dragend: (e) => {
      const { lat, lng } = e.latlng.wrap();
      setMapPosition([lat, lng]);
    },
  });
  return null;
}
export default MapView;
