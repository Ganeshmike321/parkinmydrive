import { geocodeByPlaceId } from 'react-google-places-autocomplete';

// ----------------------------------------
// Interfaces
// ----------------------------------------

interface ParkingSpot {
  latitude: number | string;
  longitude: number | string;
  [key: string]: any;
}

interface LatLng {
  lat: number;
  lng: number;
}

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapParams {
  center: LatLng;
  zoom: number;
  bounds: Bounds | null;
}

// ----------------------------------------
// Calculate Map Parameters
// ----------------------------------------

function calculateMapParams(parkingSpots: ParkingSpot[]): MapParams {
  if (!parkingSpots || parkingSpots.length === 0) {
    return {
      center: { lat: 0, lng: 0 },
      zoom: 10,
      bounds: null,
    };
  }

  let minLat = Number.MAX_VALUE;
  let maxLat = Number.MIN_VALUE;
  let minLng = Number.MAX_VALUE;
  let maxLng = Number.MIN_VALUE;

  parkingSpots.forEach((spot) => {
    const lat = parseFloat(String(spot.latitude));
    const lng = parseFloat(String(spot.longitude));
    if (!isNaN(lat) && !isNaN(lng)) {
      minLat = lat - 2;
      maxLat = lat + 2;
      minLng = lng - 2;
      maxLng = lng + 2;
    }
  });

  const center = {
    lat: (minLat + maxLat) / 2,
    lng: (minLng + maxLng) / 2,
  };

  const zoom = Math.floor(
    Math.log2(360 / Math.abs(maxLng - minLng)) - Math.log2(256) + 8
  );

  const bounds: Bounds = {
    north: maxLat,
    south: minLat,
    east: maxLng,
    west: minLng,
  };

  return {
    center,
    zoom,
    bounds,
  };
}

// ----------------------------------------
// Get Latitude and Longitude from Place ID
// ----------------------------------------

const getLatLong = async (
  placeId: string
): Promise<{ lat: number; lng: number } | { lat: null; lng: null }> => {
  try {
    const results = await geocodeByPlaceId(placeId);
    if (
      results &&
      results.length > 0 &&
      results[0].geometry &&
      results[0].geometry.location
    ) {
      const { lat, lng } = results[0].geometry.location;
      return { lat: lat(), lng: lng() };
    } else {
      throw new Error("Invalid geocode results");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return { lat: null, lng: null };
  }
};

// ----------------------------------------
// Calculate Distance Between Two Coordinates (Haversine)
// ----------------------------------------

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ----------------------------------------
// Filter Nearby Points by Distance
// ----------------------------------------

function filterNearbyPoints(
  baseLat: number,
  baseLng: number,
  points: ParkingSpot[],
  maxDistance: number
): ParkingSpot[] {
  return points.filter((point) => {
    const lat = parseFloat(String(point.latitude));
    const lng = parseFloat(String(point.longitude));
    const distance = getDistanceFromLatLonInKm(baseLat, baseLng, lat, lng);
    return distance <= maxDistance;
  });
}

// ----------------------------------------
// Exports
// ----------------------------------------

export { calculateMapParams, getLatLong, filterNearbyPoints };










// import { geocodeByPlaceId } from 'react-google-places-autocomplete';


// function calculateMapParams(parkingSpots) {
//     if (!parkingSpots || parkingSpots.length === 0) {
//         return {
//             center: { lat: 0, lng: 0 },
//             zoom: 10,
//             bounds: null,
//         };
//     }

//     // Initialize variables for calculating center, zoom, and bounds
//     let minLat = Number.MAX_VALUE;
//     let maxLat = Number.MIN_VALUE;
//     let minLng = Number.MAX_VALUE;
//     let maxLng = Number.MIN_VALUE;

//     // Calculate bounds and find minimum and maximum latitude and longitude
//     parkingSpots.forEach((spot) => {
//         const lat = parseFloat(spot.latitude);
//         const lng = parseFloat(spot.longitude);
//         if (!isNaN(lat) && !isNaN(lng)) {
//             minLat = lat - 2;
//             maxLat = lat + 2;
//             minLng = lng - 2;
//             maxLng = lng + 2;
//         }
//     });

//     // Calculate center point
//     const center = {
//         lat: (minLat + maxLat) / 2,
//         lng: (minLng + maxLng) / 2,
//     };
//     // Calculate zoom level based on the distance between minimum and maximum latitudes
//     // You can adjust this formula as needed
//     const zoom = Math.floor(
//         Math.log2(360 / Math.abs(maxLng - minLng)) - Math.log2(256) + 8
//     );

//     // Calculate bounds
//     const bounds = {
//         north: maxLat,
//         south: minLat,
//         east: maxLng,
//         west: minLng,
//     };

//     return {
//         center,
//         zoom,
//         bounds,
//     };
// }



// const getLatLong = async (placeId) => {
//     console.log("place id", placeId);
//     try {
//         const results = await geocodeByPlaceId(placeId);
//         if (results && results.length > 0 && results[0].geometry && results[0].geometry.location) {
//             const { lat, lng } = results[0].geometry.location;
//             console.log("Latitude:", lat);
//             console.log("Longitude:", lng);
//             return { lat: lat(), lng: lng() };
//         } else {
//             throw new Error("Invalid geocode results");
//         }
//     } catch (error) {
//         console.error("Geocoding error:", error);
//         return { lat: null, lng: null };
//     }
// }

// // Function to calculate distance between two points using Haversine formula
// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Radius of the Earth in km
//     const dLat = deg2rad(lat2 - lat1);
//     const dLon = deg2rad(lon2 - lon1);
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(deg2rad(lat1)) *
//         Math.cos(deg2rad(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c; // Distance in km
//     return distance;
// }

// // Function to convert degrees to radians
// function deg2rad(deg) {
//     return deg * (Math.PI / 180);
// }

// // Function to filter nearby points
// function filterNearbyPoints(baseLat, baseLng, points, maxDistance) {
//     return points.filter((point) => {
//         const distance = getDistanceFromLatLonInKm(
//             baseLat,
//             baseLng,
//             point.latitude,
//             point.longitude
//         );
//         return distance <= maxDistance;
//     });
// }




// export { calculateMapParams, getLatLong, filterNearbyPoints }

