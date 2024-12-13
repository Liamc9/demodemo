import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MapWithMarker = ({ eircode }) => {
  const [location, setLocation] = useState(null);
  const [marker, setMarker] = useState(null);
  const [user, setUser] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCzlSg0XhNmPVPOZcgWWWm_bZcnMr7zPRc", // Replace with your actual API key
  });

  const functions = getFunctions();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Authentication state changed. User:", currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!eircode) {
        console.warn("No eircode provided.");
        return;
      }

      console.log("Fetching coordinates for eircode:", eircode);

      const getLocation = httpsCallable(functions, "getLocation");
      try {
        const response = await getLocation({ eircode });
        console.log("Cloud Function response:", response.data);
        if (response.data) {
          const coords = { lat: response.data.lat, lng: response.data.lng };
          setLocation(coords);
          setMarker(coords);
          console.log("Coordinates fetched successfully:", coords);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setLocation(null);
        setMarker(null);
      }
    };

    fetchCoordinates();
  }, [eircode, user, functions]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "200px",
        borderRadius: "10px",
        border: "2px solid #ccc",
      }}
      center={location || { lat: 0, lng: 0 }} // Default center if location is null
      zoom={location ? 15 : 2} // Zoom in if location is available
      key={eircode} // Key to force re-render
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
};

export default MapWithMarker;
