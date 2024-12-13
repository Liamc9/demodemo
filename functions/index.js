const {
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");
const cors = require("cors")({origin: true}); // Enable CORS for all origins
const admin = require("firebase-admin");
const express = require("express");
const axios = require("axios");

const app = express();
app.use(cors);
admin.initializeApp();


// EXAMPLE OF ONCALL FUNCTION WITH DEBUGGING
exports.getLocation = onCall(async (request) => {
  const data = request.data;
  const eircode = data.eircode;

  // Log the received eircode
  console.log("Received eircode:", eircode);
  console.log("Received data:", data);

  // Access the Maps API Key from environment variables
  const mapsKey = process.env.MAPS_API_KEY;

  // Log the Maps API Key status (do not log the key itself for security)
  if (!mapsKey) {
    console.error("Maps API Key is not configured.");
    throw new HttpsError("failed-precondition"
        , "Maps API key is not configured.");
  } else {
    console.log("Maps API Key is configured.");
  }

  try {
    // Construct the Google Maps Geocoding API URL with query parameters
    const geocodeURL =`https://maps.googleapis.com/maps/api/geocode/json`;
    console.log("Geocoding API URL:", geocodeURL);
    console.log("Query Parameters:", {address: eircode, key: "REDACTED"});

    // Make the request to the Google Maps Geocoding API
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${eircode}&key=${mapsKey}`);

    // Log the full response data
    console.log("Google Maps API Response:", response.data);

    // Check if results are available
    const results = response.data.results;
    if (!results || results.length === 0) {
      console.warn(`No results found for eircode: ${eircode}`);
      throw new HttpsError("not-found", `No re
        sults found for eircode: ${eircode}`);
    }

    // Extract location from the first result
    const location = results[0].geometry.location;
    console.log("Extracted Location:", location);

    // Return the latitude and longitude
    return {lat: location.lat, lng: location.lng};
  } catch (error) {
    // Log the error details
    console.error("Error fetching coordinates:", error);

    // If the error is already an HttpsError, rethrow it
    if (error instanceof HttpsError) {
      throw error;
    }

    // Otherwise, throw a new internal error
    throw new HttpsError("internal", "Failed to fetch coordinates.");
  }
});
