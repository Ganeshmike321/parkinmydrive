import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { calculateMapParams, filterNearbyPoints } from "../utils/MapUtils";
import carIcon from "../assets/images/car-icon.png";

const ParkingList = ({ data }: { data: any[] }) => {
  const navigate = useNavigate();

  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [calculations, setCalculations] = useState<any>(null);
  const [nearByPlace, setNearByPlace] = useState<any[]>();
  const [pointValue, setPointValue] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>();
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
  });

  useEffect(() => {
    if (filteredData?.length) {
      const newMarkers = filteredData.map((item, index) => ({
        id: index + 1,
        placeId: item.id,
        name: item.slot_name,
        position: {
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
        },
        price: `$${+item.vehicle_fees}`,
        photo:
          item.photos?.length && item.photos[0]?.photo_path
            ? item.photos[0].photo_path
            : null,
      }));
      setMarkers(newMarkers);
      setCalculations(calculateMapParams(filteredData));
    }
  }, [filteredData]);

  useEffect(() => {
    if (data?.length) {
      const newPoints = data.map((item) => ({
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
      }));
      setPointValue(newPoints);
    }
  }, []);

  useEffect(() => {
    const lat = localStorage.getItem("latitude");
    const lng = localStorage.getItem("longitude");
    if (lat && lng && pointValue.length > 0) {
      const nearbyPoints = filterNearbyPoints(parseFloat(lat), parseFloat(lng), pointValue, 10);
      setNearByPlace(nearbyPoints);
    }
  }, [pointValue]);

  useEffect(() => {
    if (nearByPlace && data) {
      const filterData = data.filter((item) =>
        nearByPlace.some(
          (place) =>
            place.latitude == item.latitude &&
            place.longitude == item.longitude
        )
      );
      setFilteredData(filterData);
    }
  }, [nearByPlace, data]);

  const handleClick = (id: number) => {
    navigate(`/booking-detail/${id}`, { state: id });
  };

  const handleMarkerHover = (id: number) => setHoveredMarker(id);

  const handleActiveMarker = (id: number) => {
    if (id !== activeMarker) {
      setActiveMarker(id);
      setHoveredMarker(null);
    }
  };

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  return (
    <div className="container">
      {filteredData?.length ? (
        <div className="detailsOuter">
          <div className="finddetailsLeft">
            <div style={{ maxHeight: "700px", overflowY: "auto" }}>
              {filteredData.map((item) => (
                <div className="listingLeft" key={item.id}>
                  <div className="detailImage">
                    {item.photos?.length > 0 && item.photos[0]?.photo_path && (
                      <img
                        src={`${
                          import.meta.env.VITE_APP_BASE_URL
                        }/storage/${item.photos[0].photo_path.slice(6)}`}
                        className="img-fluid height-img"
                      />
                    )}
                  </div>
                  <div className="finddetailsRight detailsRight">
                    <h3>
                      <a>{item.slot_name}</a>
                    </h3>
                    <div className="price">${item.vehicle_fees || "10"}</div>
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
                  mapContainerStyle={{ width: "100%", height: "60vh" }}
                >
                  {markers.map((marker) => (
                    <Marker
                      key={marker.id}
                      position={marker.position}
                      onClick={() => handleActiveMarker(marker.id)}
                      onMouseOver={() => handleMarkerHover(marker.id)}
                      zIndex={
                        marker.id === activeMarker ||
                        marker.id === hoveredMarker
                          ? 1
                          : 0
                      }
                      icon={{
                        url: carIcon,
                        scaledSize: new window.google.maps.Size(60, 60),
                        labelOrigin: new window.google.maps.Point(30, 70),
                      }}
                      label={{
                        className:
                          marker.id === activeMarker
                            ? "activeMarker"
                            : marker.id === hoveredMarker
                            ? "setHover"
                            : "nonActiveMarker",
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
                            <img
                              src={
                                marker.photo
                                  ? `${
                                      import.meta.env.VITE_APP_BASE_URL
                                    }/storage/${marker.photo.slice(6)}`
                                  : carIcon 
                              }
                              className="card-image"
                            />
                            <div className="info-card">
                              <div className="name">{marker.name}</div>
                              <div className="price">{marker.price}</div>
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
            <a href="/find-economy-parking">click here</a> to find more...
          </p>
        </div>
      )}
    </div>
  );
};

export default ParkingList;



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
// import { calculateMapParams, filterNearbyPoints } from "../utils/MapUtils";
// import carIcon from '../assets/images/car-icon.png';

// const ParkingList = ({ data }) => {
//   console.log('aaa', data);
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
//     if (filteredData && filteredData.length > 0) {
//       const newMarkers = filteredData.map((item, index) => ({
//         id: index + 1,
//         placeId: item.id,
//         name: item.slot_name,
//         position: {
//           lat: parseFloat(item.latitude),
//           lng: parseFloat(item.longitude),
//         },
//         price: `$${+item.vehicle_fees}`,
//         photo: item.photos &&
//             item.photos.length > 0 &&
//             item.photos[0].photo_path && (item?.photos[0].photo_path)
//       }));
//       setMarkers(newMarkers);
//     }
//     const calculationsData = calculateMapParams(filteredData);
//     setCalculations(calculationsData);
//   }, [filteredData]);

//   useEffect(() => {
//     console.log('qwer', data)
//     if (data && data.length > 0) {
//       const newPoints = data.map((item, index) => ({
//         latitude: parseFloat(item.latitude),
//         longitude: parseFloat(item.longitude),
//       }));
//       setPointValue(newPoints);
//     }
//   }, []);

//   const handleMarkerHover = (id) => {
//     setHoveredMarker(id);
//   };

//   const handleClick = (data) => {
//     // navigate(`/review-booking/${id}`);
//     navigate(`/booking-detail/${data}`, { state: data });
//   };

//   const handleActiveMarker = (marker) => {
//     if (marker === activeMarker) {
//       return;
//     }
//     setActiveMarker(marker);
//     setHoveredMarker(null);
//   };

//   const onLoad = React.useCallback((map) => {
//     setMap(map);
//   }, []);

//   const onUnmount = React.useCallback(() => {
//     setMap(null);
//   }, []);

//   useEffect(() => {
//     console.log("vc points", pointValue);
//     const storedLatitude = localStorage.getItem("latitude");
//     const storedLongitude = localStorage.getItem("longitude");

//     console.log("LAT AND LNG", storedLatitude, storedLongitude);

//     // Example usage
//     const baseLat = storedLatitude; // Base latitude
//     const baseLng = storedLongitude; // Base longitude
//     const maxDistance = 10; // Maximum distance in km

//     // Filter nearby points
//     const nearbyPoints = filterNearbyPoints(
//         baseLat,
//         baseLng,
//         pointValue,
//         maxDistance
//     );
//     setNearByPlace(nearbyPoints);
//     console.log("vc Nearby Points:", nearbyPoints);
//   }, [pointValue]);

//   useEffect(() => {
//     console.log("un filterd data", data);
//     // Filter data based on nearby places
//     if (nearByPlace && data) {
//       // Filter data based on nearby places
//       const filterData = data.filter((item) =>
//           nearByPlace.some(
//               (place) =>
//                   place.latitude == item.latitude && place.longitude == item.longitude
//           )
//       );

//       console.log(filterData);
//       setFilteredData(filterData);

//       console.log("flitered data", filterData);
//     } else {
//       console.error("nearbyPlace or data is undefined");
//     }
//   }, [nearByPlace, data]);

//   if (loadError) {
//     return <div>Error loading Google Maps API</div>;
//   }

//   return (
//       <div className="container">
//         {filteredData?.length > 0 ? (
//             <div className="detailsOuter">
//               <div className="finddetailsLeft">
//                 <div style={{ maxHeight: "700px", overflowY: "auto" }}>
//                   {filteredData?.map((item) => (
//                       <div className="listingLeft" key={item.id}>
//                         <div className="detailImage">
//                           {item.photos &&
//                               item.photos.length > 0 &&
//                               item.photos[0].photo_path && (
//                                   <img
//                                       src={`${
//                                           import.meta.env.VITE_APP_BASE_URL
//                                       }/storage/${item.photos[0].photo_path.slice(6)}`}
//                                       className="img-fluid height-img"
//                                   />
//                               )}
//                           {/* <img src={ListImg} className="img-fluid" alt="List" /> */}
//                         </div>
//                         <div className="finddetailsRight detailsRight">
//                           <h3>
//                             <a>{item.slot_name}</a>
//                           </h3>
//                           <div className="price">${item.vehicle_fees || "10"}</div>
//                           <div className="mapButtons">
//                             <button
//                                 className="btn btn-primary mt-2"
//                                 onClick={() => handleClick(item.id)}
//                             >
//                               Book Now
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="finddetailsRightOuter">
//                 <div className="mapOuter">
//                   {isLoaded && !loadError && (
//                       <GoogleMap
//                           onLoad={onLoad}
//                           center={{
//                             lat: calculations?.center?.lat,
//                             lng: calculations?.center?.lng,
//                           }} // Adjust center if needed
//                           zoom={14}
//                           onUnmount={onUnmount}
//                           mapContainerStyle={{ width: "100%", height: "60vh" }}
//                       >
//                         {markers?.map((marker) => (
//                             <Marker
//                                 key={marker.id}
//                                 position={marker.position}
//                                 onClick={() => handleActiveMarker(marker.id)}
//                                 onMouseOver={() => handleMarkerHover(marker.id)}
//                                 zIndex={(marker.id === activeMarker || marker.id === hoveredMarker ) ? 1 : 0}
//                                 icon={{
//                                   url: carIcon,
//                                   scaledSize: new window.google.maps.Size(60, 60),
//                                   labelOrigin: new window.google.maps.Point(30, 70),
//                                 }}
//                                 label={{
//                                   className: (marker.id === activeMarker) ? 'activeMarker' : (marker.id === hoveredMarker) ? 'setHover' : 'nonActiveMarker',
//                                   text: marker.name + ' - ' + marker.price,
//                                   color: marker.id === activeMarker ? 'white' : 'black',
//                                   fontSize: '18px',
//                                 }}
//                             >
//                               {marker.id === activeMarker && (
//                                   <InfoWindow position={marker.position} onCloseClick={() => { setActiveMarker(null) }}>
//                                     <div>
//                                       {/* <button>X</button> */}
//                                       {marker && marker.photo ?
//                                           (<img
//                                               src={`${import.meta.env.VITE_APP_BASE_URL
//                                               }/storage/${marker.photo.slice(6)}`}
//                                               className="card-image"
//                                           />) : (<img
//                                               src={`${noPreview}`}
//                                               className="card-image"
//                                           />)}
//                                       <div className="info-card">
//                                         <div>
//                                           <div className="name">{marker.name}</div>
//                                           <div className="price">{marker.price || "10"}</div>
//                                           <div className="mapButtons">
//                                             <button
//                                                 className="btn btn-primary"
//                                                 onClick={() => handleClick(marker.placeId)}
//                                             >
//                                               Book Now
//                                             </button>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </InfoWindow>
//                               )}
//                             </Marker>
//                         ))}
//                       </GoogleMap>
//                   )}
//                 </div>
//               </div>
//             </div>
//         ) : (
//             <div
//                 style={{
//                   height: "200px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//             >
//               <p>No spots found for the location111. Please <a href="/find-economy-parking">click</a> here to find more...</p>
//             </div>
//         )}
//       </div>
//   );
// };

// export default ParkingList;
