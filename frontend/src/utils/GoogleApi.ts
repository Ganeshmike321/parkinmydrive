import axios from 'axios';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';

interface GooglePlaceResult {
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface LatLong {
  lat: number | null;
  lng: number | null;
}

const fetchGooglePlacesData = async (input: string): Promise<any[]> => {
  const apiKey = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  console.log("Google Api key", apiKey, input);
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(input)}&key=${apiKey}`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching Google Places data:', error);
    return [];
  }
};

const getLatLong = async (placeId: string): Promise<LatLong> => {
  console.log("place id", placeId);
  try {
    const results = await geocodeByPlaceId(placeId) as GooglePlaceResult[];
    if (
      results &&
      results.length > 0 &&
      results[0].geometry &&
      results[0].geometry.location
    ) {
      const { lat, lng } = results[0].geometry.location;
      console.log("Latitude:", lat());
      console.log("Longitude:", lng());
      return { lat: lat(), lng: lng() };
    } else {
      throw new Error("Invalid geocode results");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return { lat: null, lng: null };
  }
};

export { getLatLong, fetchGooglePlacesData };
