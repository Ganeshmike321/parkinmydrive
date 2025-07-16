import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { calculateMapParams } from "../utils/MapUtils.ts";
import carIcon from "../assets/images/car-icon.png";

interface Photo {
  photo_path: string;
}

interface ParkingSpot {
  id: number;
  slot_name: string;
  latitude: string;
  longitude: string;
  vehicle_fees: string;
  photos?: Photo[];
  distance: number;
}

interface MarkerData {
  id: number;
  placeId: number;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  price: string;
  photo: string | null;
  distance: string;
}

interface NearParkingListsProps {
  data: ParkingSpot[];
}

const NearParkingLists: React.FC<NearParkingListsProps> = ({ data }) => {
  const navigate = useNavigate();

  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [calculations, setCalculations] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<ParkingSpot[]>([]);
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY as string,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const newMarkers = data.map((item, index) => ({
        id: index + 1,
        placeId: item.id,
        name: item.slot_name,
        position: {
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
        },
        price: `$${+item.vehicle_fees}`,
        photo:
          item.photos?.length && item.photos[0].photo_path
            ? item.photos[0].photo_path
            : null,
        distance: `${item.distance.toFixed(2)} km`,
      }));
      setMarkers(newMarkers);
      setFilteredData(data);
      const calculationsData = calculateMapParams(data);
      setCalculations(calculationsData);
    }
  }, [data]);

  const handleMarkerHover = (id: number) => {
    setHoveredMarker(id);
  };

  const handleClick = (id: number) => {
    navigate(`/booking-detail/${id}`);
  };

  const handleActiveMarker = (markerId: number) => {
    setActiveMarker(markerId === activeMarker ? null : markerId);
    setHoveredMarker(null);
  };

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  return (
    <div className="container">
      {filteredData?.length > 0 ? (
        <div className="detailsOuter">
          <div className="finddetailsLeft">
            <div style={{ maxHeight: "700px", overflowY: "auto" }}>
              {filteredData.map((item) => (
                <div className="listingLeft" key={item.id}>
                  <div className="detailImage">
                    {item.photos?.[0]?.photo_path && (
                      <img
                        src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${item.photos[0].photo_path.slice(6)}`}
                        className="img-fluid height-img"
                        alt={item.slot_name}
                      />
                    )}
                  </div>
                  <div className="finddetailsRight detailsRight">
                    <h3>
                      <a>{item.slot_name}</a>
                    </h3>
                    <div className="price">${item.vehicle_fees || "10"}</div>
                    <div className="distance">
                      Distance: {item.distance.toFixed(2)} km
                    </div>
                    <div className="mapButtons">
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => handleClick(item.id)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="finddetailsRightOuter">
            <div className="mapOuter">
              {isLoaded && (
                <GoogleMap
                  onLoad={onLoad}
                  center={{
                    lat: calculations?.center?.lat || 0,
                    lng: calculations?.center?.lng || 0,
                  }}
                  zoom={14}
                  onUnmount={onUnmount}
                  mapContainerStyle={{ width: "100%", height: "80vh" }}
                >
                  {markers.map((marker) => (
                    <Marker
                      key={marker.id}
                      position={marker.position}
                      onClick={() => handleActiveMarker(marker.id)}
                      onMouseOver={() => handleMarkerHover(marker.id)}
                      icon={{
                        url: carIcon,
                        scaledSize: new window.google.maps.Size(60, 60),
                        labelOrigin: new window.google.maps.Point(30, 70),
                      }}
                      label={{
                        text: `${marker.name} - ${marker.price}`,
                        color:
                          marker.id === activeMarker ? "white" : "black",
                        fontSize: "18px",
                      }}
                    >
                      {marker.id === activeMarker && (
                        <InfoWindow
                          position={marker.position}
                          onCloseClick={() => setActiveMarker(null)}
                        >
                          <div>
                            {marker.photo ? (
                              <img
                                src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${marker.photo.slice(6)}`}
                                className="card-image"
                                alt="Parking spot"
                              />
                            ) : (
                              <p>No image available</p>
                            )}
                            <div className="info-card">
                              <div className="name">{marker.name}</div>
                              <div className="price">{marker.price}</div>
                              <div className="distance">
                                Distance: {marker.distance}
                              </div>
                              <div className="mapButtons">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleClick(marker.placeId)}
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}
                </GoogleMap>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>
            No spots found for the location. Please{" "}
            <a href="/find-economy-parking">click</a> here to find more...
          </p>
        </div>
      )}
    </div>
  );
};

export default NearParkingLists;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
// import { calculateMapParams, filterNearbyPoints } from "../utils/MapUtils";
// import carIcon from '../assets/images/car-icon.png';

// const NearParkingLists = ({ data }) => {
//   const navigate = useNavigate();
//   const [activeMarker, setActiveMarker] = useState(null);
//   const [map, setMap] = useState(null);
//   const [markers, setMarkers] = useState([]);
//   const [calculations, setCalculations] = useState(null);
//   const [nearByPlace, setNearByPlace] = useState();
//   const [pointValue, setPointValue] = useState([]);
//   const [filteredData, setFilteredData] = useState();
//   const [hoveredMarker, setHoveredMarker] = useState(null);

//   const { isLoaded, loadError } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
//   });

//   useEffect(() => {
//     if (data && data.length > 0) {
//       const newMarkers = data.map((item, index) => ({
//         id: index + 1,
//         placeId: item.id,
//         name: item.slot_name,
//         position: {
//           lat: parseFloat(item.latitude),
//           lng: parseFloat(item.longitude),
//         },
//         price: `$${+item.vehicle_fees}`,
//         photo: item.photos && item.photos.length > 0 && item.photos[0].photo_path 
//           ? item.photos[0].photo_path : null,
//         distance: item.distance.toFixed(2) + ' km' // Format distance to 2 decimal places
//       }));
//       setMarkers(newMarkers);
//       setFilteredData(data);
//       const calculationsData = calculateMapParams(data);
//       setCalculations(calculationsData);
//     }
//   }, [data]);

//   const handleMarkerHover = (id) => {
//     setHoveredMarker(id);
//   };

//   const handleClick = (id) => {
//     navigate(`/booking-detail/${id}`);
//   };

//   const handleActiveMarker = (marker) => {
//     setActiveMarker(marker === activeMarker ? null : marker);
//     setHoveredMarker(null);
//   };

//   const onLoad = React.useCallback((map) => {
//     setMap(map);
//   }, []);

//   const onUnmount = React.useCallback(() => {
//     setMap(null);
//   }, []);

//   if (loadError) {
//     return <div>Error loading Google Maps API</div>;
//   }

//   return (
//     <div className="container">
//       {filteredData?.length > 0 ? (
//         <div className="detailsOuter">
//           <div className="finddetailsLeft">
//             <div style={{ maxHeight: "700px", overflowY: "auto" }}>
//               {filteredData.map((item) => (
//                 <div className="listingLeft" key={item.id}>
//                   <div className="detailImage">
//                     {item.photos && item.photos.length > 0 && item.photos[0].photo_path && (
//                       <img
//                         src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${item.photos[0].photo_path.slice(6)}`}
//                         className="img-fluid height-img"
//                         alt={item.slot_name}
//                       />
//                     )}
//                   </div>
//                   <div className="finddetailsRight detailsRight">
//                     <h3><a>{item.slot_name}</a></h3>
//                     <div className="price">${item.vehicle_fees || "10"}</div>
//                     <div className="distance">Distance: {item.distance.toFixed(2)} km</div>
//                     <div className="mapButtons">
//                       <button
//                         className="btn btn-primary mt-2"
//                         onClick={() => handleClick(item.id)}
//                       >
//                         Book Now
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="finddetailsRightOuter">
//             <div className="mapOuter">
//               {isLoaded && !loadError && (
//                 <GoogleMap
//                   onLoad={onLoad}
//                   center={{
//                     lat: calculations?.center?.lat || 0,
//                     lng: calculations?.center?.lng || 0,
//                   }}
//                   zoom={14}
//                   onUnmount={onUnmount}
//                   mapContainerStyle={{ width: "100%", height: "80vh" }}
//                 >
//                   {markers.map((marker) => (
//                     <Marker
//                       key={marker.id}
//                       position={marker.position}
//                       onClick={() => handleActiveMarker(marker.id)}
//                       onMouseOver={() => handleMarkerHover(marker.id)}
//                       icon={{
//                         url: carIcon,
//                         scaledSize: new window.google.maps.Size(60, 60),
//                         labelOrigin: new window.google.maps.Point(30, 70),
//                       }}
//                       label={{
//                         text: `${marker.name} - ${marker.price}`,
//                         color: marker.id === activeMarker ? 'white' : 'black',
//                         fontSize: '18px',
//                       }}
//                     >
//                       {marker.id === activeMarker && (
//                         <InfoWindow position={marker.position} onCloseClick={() => setActiveMarker(null)}>
//                           <div>
//                             {marker.photo ? (
//                               <img
//                                 src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${marker.photo.slice(6)}`}
//                                 className="card-image"
//                                 alt="Parking spot"
//                               />
//                             ) : (
//                               <p>No image available</p>
//                             )}
//                             <div className="info-card">
//                               <div>
//                                 <div className="name">{marker.name}</div>
//                                 <div className="price">{marker.price || "10"}</div>
//                                 <div className="distance">Distance: {marker.distance}</div>
//                                 <div className="mapButtons">
//                                   <button
//                                     className="btn btn-primary"
//                                     onClick={() => handleClick(marker.placeId)}
//                                   >
//                                     Book Now
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </InfoWindow>
//                       )}
//                     </Marker>
//                   ))}
//                 </GoogleMap>
//               )}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div
//           style={{
//             height: "200px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <p>No spots found for the location. Please <a href="/find-economy-parking">click</a> here to find more...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NearParkingLists;
