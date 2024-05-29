import React, { useState, useMemo, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

function Subscribe() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const mapOptions = useMemo(() => ({
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
    ],
  }), []);

  useEffect(() => {
    setLat();
    setLng();
  }, []);

  return (
    <div id="location" className="subscribe">
      {isLoaded && lat && lng && (
        <GoogleMap
          mapContainerStyle={{ height: "500px", width: "100%" }}
          options={mapOptions}
          center={{ lat, lng }}
          zoom={18.8}
        >
          <Marker
            position={{ lat, lng }}
          />
        </GoogleMap>
      )}
    </div>
  );
}

export default Subscribe;
