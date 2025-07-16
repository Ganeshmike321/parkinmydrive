import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PopularParking from "../../components/PopularParking";
import ParkingSpace from "../../components/ParkingSpace";
import Search from "../../components/Search";
import ParkingList from "../../components/ParkingListOld";
import Loader from "../../components/Loader";
import AxiosClient from "../../axios/AxiosClient";
import { combineDateTime } from "../../utils/DateTime";

// Types
interface ParkingSpot {
  id: string;
  name: string;
  location: string;
  price: number;
  availability: boolean;
  // Add other properties as needed
}

interface SearchState {
  from: string;
  to: string;
  destination: string;
  selectedFromTime: string;
  selectedToTime: string;
}

interface RootState {
  search: {
    value: SearchState;
  };
}

interface FormData {
  from: string | Date;
  to: string | Date;
  event: string;
  destination: string;
  vehicle_type: string;
}

interface LocationState {
  parkingData?: ParkingSpot[];
}

// Custom hooks
const useSearchState = () => {
  return useSelector((state: RootState) => state.search.value);
};

const useParkingApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const makeApiCall = useCallback(async (apiCall: () => Promise<any>) => {
    setError(null);
    setLoading(true);
    try {
      await AxiosClient.get("/sanctum/csrf-cookie");
      const response = await apiCall();
      return response;
    } catch (err) {
      setError("Internal Server Error");
      console.error("Error fetching data from the API:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, makeApiCall };
};

// Constants
const DEFAULT_FORM_DATA: FormData = {
  from: new Date(),
  to: new Date(),
  event: "",
  destination: "OMR",
  vehicle_type: "",
};

const EMPTY_CONTENT_STYLE: React.CSSProperties = {
  height: "200px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// Main component
const Listing: React.FC = () => {
  const searchState = useSearchState();
  const location = useLocation();
  const state = location.state as LocationState;
  const { loading, error, makeApiCall } = useParkingApi();

  const [parkingListData, setParkingListData] = useState<ParkingSpot[]>([]);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);

  // Memoized values
  const hasValidSearchDates = useMemo(() => {
    return searchState.from !== "" && searchState.to !== "";
  }, [searchState.from, searchState.to]);

  const searchFormData = useMemo(() => ({
    from: searchState.from,
    to: searchState.to,
    event: "",
    destination: searchState.destination,
    vehicle_type: "",
  }), [searchState.from, searchState.to, searchState.destination]);

  // API functions
  const fetchParkingSpotsByDateTime = useCallback(async (): Promise<void> => {
    if (!hasValidSearchDates) return;

    setParkingListData([]);
    
    try {
      const response = await makeApiCall(() => 
        AxiosClient.post("/api/getParkingSpotsByDateTime", {
          from_datetime: combineDateTime(searchState.from, searchState.selectedFromTime),
          to_datetime: combineDateTime(searchState.to, searchState.selectedToTime),
        })
      );
      
      if (response.status === 200) {
        setParkingListData(response.data);
      }
    } catch (err) {
      // Error handled in useParkingApi hook
    }
  }, [hasValidSearchDates, searchState, makeApiCall]);

  const fetchAllParkingSpots = useCallback(async (): Promise<void> => {
    setParkingListData([]);
    
    try {
      const response = await makeApiCall(() => 
        AxiosClient.get("/api/getParkingSpots")
      );
      
      if (response.status === 200) {
        console.log("response data", response.data);
        setParkingListData(response.data);
      }
    } catch (err) {
      // Error handled in useParkingApi hook
    }
  }, [makeApiCall]);

  // Effects
  useEffect(() => {
    console.log("Search state changed:", searchState.from);
    setFormData(hasValidSearchDates ? searchFormData : DEFAULT_FORM_DATA);
    
    if (hasValidSearchDates) {
      fetchParkingSpotsByDateTime();
    }
  }, [hasValidSearchDates, searchFormData, fetchParkingSpotsByDateTime]);

  useEffect(() => {
    if (hasValidSearchDates) {
      fetchParkingSpotsByDateTime();
    }
    
    if (state?.parkingData) {
      console.log("Location state:", state);
      setParkingListData(state.parkingData);
    } else {
      fetchAllParkingSpots();
    }
  }, []);

  // Render functions
  const renderLoadingState = (): React.JSX.Element => (
    <div style={EMPTY_CONTENT_STYLE}>
      <Loader />
    </div>
  );

  const renderErrorState = (): React.JSX.Element => (
    <div style={EMPTY_CONTENT_STYLE}>
      <span className="text-danger">{error}</span>
    </div>
  );

  const renderEmptyState = (): React.JSX.Element => (
    <div style={EMPTY_CONTENT_STYLE}>
      <p>
        No spots found for the location. Please{" "}
        <a href="/find-economy-parking">click</a> here to find more...
      </p>
    </div>
  );

  const renderContent = (): React.JSX.Element => {
    if (loading) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

    if (parkingListData.length > 0) {
      return <ParkingList data={parkingListData} />;
    }

    return renderEmptyState();
  };

  return (
    <>
      {/* <Header /> */}
      <Search title="Refine Your Parking Selection" handleApi={fetchParkingSpotsByDateTime}   />
      {renderContent()}
      <ParkingSpace />
      <PopularParking />
      <Footer />
    </>
  );
};

export default Listing;




// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import PopularParking from "../../components/PopularParking";
// import ParkingSpace from "../../components/ParkingSpace";
// import Search from "../../components/Search";
// import ParkingList from "../../components/ParkingListOld";
// import { useEffect, useState } from "react";
// import AxiosClient from "../../axios/AxiosClient";
// import { combineDateTime } from "../../utils/DateTime";
// import Loader from "../../components/Loader";

// import { useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";

// const Listing = () => {
//   const searchState = useSelector((state) => {
//     return state.search.value;
//   });
//   const { state } = useLocation();

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
//     console.log("getapi", searchState.from);
//     setParkingListData([]);
//     setError(null);
//     try {
//       setLoading(true); // Set loading state to true when fetching data
//       await AxiosClient.get("/sanctum/csrf-cookie");
//       const { data, status } = await AxiosClient.post(
//         "/api/getParkingSpotsByDateTime",
//         {
//           from_datetime: combineDateTime(
//             searchState.from,
//             searchState.selectedFromTime
//           ),
//           to_datetime: combineDateTime(
//             searchState.to,
//             searchState.selectedToTime
//           ),
//         }
//       );
//       if (status === 200) {
//         setParkingListData(data);
//       }
//     } catch (error) {
//       setError("Internal Server Error");
//       console.error("Error fetching data from the API:", error);
//     } finally {
//       setLoading(false); // Set loading state to false when fetching is done
//     }
//   };

//   useEffect(() => {
//     console.log("getapi useeffect", searchState.from);
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
//         destination: "OMR",
//         vehicle_type: "",
//       }));
//     }
//   }, [searchState.from, searchState.to, searchState.destination, searchState]);

//   useEffect(() => {
//     if (searchState.from !== "" && searchState.to !== "") {
//       getApi();
//     }
//     if (state) {
//       console.log(state);
//       setParkingListData(state);
//     }
//     getParkingList();
//   }, []);

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

//   return (
//     <>
//       {/* <Header /> */}

//       <Search title="Refine Your Parking Selection" />
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
//             <ParkingList data={parkingListData} />
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
//       <ParkingSpace />
//       <PopularParking />
//       <Footer />
//     </>
//   );
// };

// export default Listing;
