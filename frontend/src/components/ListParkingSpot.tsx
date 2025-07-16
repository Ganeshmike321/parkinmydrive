import { useEffect, useState } from "react";
import AxiosClient from "../axios/AxiosClient";
import BreadCrumbs from "./BreadCrumbs";
import ParkingList from "./ParkingList";
import Loader from "./Loader";
import { combineDateTime } from "../utils/DateTime";
import { useSelector } from "react-redux";
import type  { RootState } from "../redux/store"; // Adjust path if needed
import type { ParkingSpot } from "../types/ParkingSpot";

interface SearchState {
  from: string;
  to: string;
  destination: string;
  selectedFromTime: string;
  selectedToTime: string;
  lat: string;
  lng: string;
}

const ListParkingSpot: React.FC = () => {
  const searchState: SearchState = useSelector(
    (state: RootState) => state.search.value
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [parkingListData, setParkingListData] = useState<ParkingSpot[]>([]);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    event: "",
    destination: "",
    vehicle_type: "",
  });
  const [error, setError] = useState<string | null>(null);

  const getApi = async () => {
    setParkingListData([]);
    setError(null);
    try {
      setLoading(true);
      await AxiosClient.get("/sanctum/csrf-cookie");
      const { data, status } = await AxiosClient.post(
        "/api/getParkingSpotsByLocation",
        {
          from_datetime: combineDateTime(
            searchState.from,
            searchState.selectedFromTime
          ),
          to_datetime: combineDateTime(
            searchState.to,
            searchState.selectedToTime
          ),
          latitude: searchState.lat,
          longitude: searchState.lng,
        }
      );

      if (status === 200) {
        const spotsArray = Object.values(data) as ParkingSpot[];
        setParkingListData(spotsArray);
      }
    } catch (error) {
      setError("Internal Server Error");
      console.error("Error fetching data from the API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData({
      from: searchState.from,
      to: searchState.to,
      event: "",
      destination: searchState.destination,
      vehicle_type: "",
    });

    if (searchState.from !== "" && searchState.to !== "") {
      getApi();
    } else {
      setFormData({
        from: new Date().toString(),
        to: new Date().toString(),
        event: "",
        destination: "",
        vehicle_type: "",
      });
    }
  }, [searchState]);

  return (
    <>
      <BreadCrumbs title={"Find A Parking Spot"} />
      <br />

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <Loader />
        </div>
      ) : (
        <>
          {error && (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
              <span className="text-danger">{error}</span>
            </div>
          )}

          {parkingListData.length > 0 ? (
            <ParkingList
              data={parkingListData.filter((spot) => spot.status === 0)}
            />
          ) : (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
              <p>
                No spots found for the location. Please <a href="/find-economy-parking">click here</a> to find more...
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ListParkingSpot;



// import { useEffect, useState } from "react";
// import AxiosClient from "../axios/AxiosClient";
// import BreadCrumbs from "./BreadCrumbs";
// import Footer from "./Footer";
// import Header from "./Header";
// import { combineDateTime } from "../utils/DateTime";
// import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import ParkingList from "./ParkingList";
// import Loader from "./Loader"; 

// const ListParkingSpot = () => {
//   const searchState = useSelector((state) => {
//     return state.search.value;
//   });
//   const [loading, setLoading] = useState(false);
//   const [parkingListData, setParkingListData] = useState([]);
//   const [formData, setFormData] = useState({
//     from: "",
//     to: "",
//     event: "",
//     destination: "",
//     vehicle_type: "",
//   });
//   const [error, setError] = useState(null);

//   const getApi = async () => {
//     setParkingListData([]);
//     setError(null);
//     try {
//       setLoading(true); // Set loading state to true when fetching data
//       await AxiosClient.get("/sanctum/csrf-cookie");
//       const { data, status } = await AxiosClient.post(
//         "/api/getParkingSpotsByLocation",
//         {
//           from_datetime: combineDateTime(
//             searchState.from,
//             searchState.selectedFromTime
//           ),
//           to_datetime: combineDateTime(
//             searchState.to,
//             searchState.selectedToTime
//           ),
//           latitude: searchState.lat,
//           longitude: searchState.lng
//         }
//       );
//       if (status === 200) {
//         const spotsArray = Object.values(data);
//         setParkingListData(spotsArray);
//       }
//     } catch (error) {
//       setError("Internal Server Error");
//       console.error("Error fetching data from the API:", error);
//     } finally {
//       setLoading(false); // Set loading state to false when fetching is done
//     }
//   };

//   useEffect(() => {
//     setFormData((state) => ({
//       from: searchState.from,
//       to: searchState.to,
//       event: "",
//       destination: searchState.destination,
//       vehicle_type: "",
//     }));
//     if (searchState.from !== "" && searchState.to !== "") {
//       getApi();
//     } else {
//       setFormData((state) => ({
//         from: new Date(),
//         to: new Date(),
//         event: "",
//         destination: "",
//         vehicle_type: "",
//       }));
//     }
//   }, [searchState.from, searchState.to, searchState.destination, searchState]);

//   // useEffect(() => {
//   //   if (searchState.from !== "" && searchState.to !== "") {
//   //     getApi();
//   //   }
//   //   if (state) {
//   //     console.log(state);
//   //     setParkingListData(state);
//   //   }
//   //   getParkingList();
//   // }, []);

//   const getParkingList = async () => {
//     setParkingListData([]);
//     setError(null);
//     try {
//       setLoading(true); // Set loading state to true when fetching data
//       await AxiosClient.get("/sanctum/csrf-cookie");
//       const { data, status } = await AxiosClient.get("/api/getParkingSpots");
//       if (status === 200) {
//         console.log("response data", data);
//         setParkingListData(data);
//       }
//     } catch (error) {
//       setError("Internal Server Error");
//       console.error("Error fetching data from the API:", error);
//     } finally {
//       setLoading(false); // Set loading state to false when fetching is done
//     }
//   };
//   console.log('asdf 2', parkingListData);

//   return (
//     <>
//       {/* <Header /> */}
//       <BreadCrumbs title={"Find A Parking Spot"} />
//       <br />

//       {loading ? (
//         <div
//           style={{
//             height: "200px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Loader />
//         </div>
//       ) : (
//         <>
//           {error && (
//             <div
//               style={{
//                 height: "200px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <span className="text-danger">{error}</span>
//             </div>
//           )}
//           {parkingListData.length > 0 ? (
//             <ParkingList
//               data={parkingListData.filter((data) => data.status === 0)}
//             />
//           ) : (
//             <div
//               style={{
//                 height: "200px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <p>No spots found for the location. Please <a href="/find-economy-parking">click</a> here to find more...</p>
//             </div>
//           )}
//         </>
//       )}

//     </>
//   );
// };

// export default ListParkingSpot;
