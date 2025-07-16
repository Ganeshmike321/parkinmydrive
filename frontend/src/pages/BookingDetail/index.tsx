import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import DatePicker from "react-datepicker";
import { useJsApiLoader } from "@react-google-maps/api";
import Streetview from 'react-google-streetview';

// Components
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import BreadCrumbs from "../../components/BreadCrumbs";

// Assets
import DetailImage from "../../assets/images/detailimage.jpg";
import DetailImage1 from "../../assets/images/detailimage1.jpg";

// Utils & Services
import AxiosClient from "../../axios/AxiosClient";
import { calculateTotalDuration, formatDateYear, combineDateTime } from "../../utils/DateTime";
import { searchSubmit } from "../../redux/searchSlice";

// Types
interface ParkingItem {
  id: string;
  slot_name: string;
  latitude: string;
  longitude: string;
  nearby_places?: string;
  vehicle_fees: number;
  photos?: { photo_path: string }[];
}

interface FormData {
  from: Date;
  to: Date;
  vehicle_type: string;
  selectedFromTime: string;
  selectedToTime: string;
}

interface FormErrors {
  from: string;
  to: string;
  no_of_vehicle: string;
  hours: string;
  vehicle_type: string;
}

interface SearchState {
  from: Date;
  to: Date;
  selectedFromTime: string;
  selectedToTime: string;
}

// Custom Components
const CustomDatePickerInput = ({ value, onClick }: { value: string; onClick: () => void }) => (
  <div className="input-group date picker-date" id="datepicker">
    <input
      type="text"
      className="form-control style-2 border-right"
      value={value}
      onClick={onClick}
      placeholder="Date"
      readOnly
    />
    <span className="input-group-append" onClick={onClick}>
      <span className="input-group-text bg-white d-block">
        <i className="fa fa-calendar"></i>
      </span>
    </span>
  </div>
);

const TimeSelector = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <select
    className="form-control style-2"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {Array.from({ length: 24 }, (_, index) => {
      const hour = index % 12 || 12;
      const ampm = index < 12 ? "AM" : "PM";
      const formattedHour = ("0" + hour).slice(-2);
      const formattedTime = `${formattedHour}:00 ${ampm}`;
      return (
        <option key={index} value={formattedTime}>
          {formattedTime}
        </option>
      );
    })}
  </select>
);

const ImageCarousel = ({ item }: { item: ParkingItem }) => (
  <div id="carouselExampleFade" className="carousel slide carousel-fade">
    <div className="carousel-inner">
      <div className="carousel-item active">
        {item.photos && item.photos.length > 0 && item.photos[0].photo_path ? (
          <img
            src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${item.photos[0].photo_path.slice(6)}`}
            className="img-fluid"
            alt={item.slot_name}
          />
        ) : (
          <img src={DetailImage} className="img-fluid" alt="Default parking" />
        )}
      </div>
      <div className="carousel-item">
        <img src={DetailImage1} className="img-fluid" alt="Parking view 1" />
      </div>
      <div className="carousel-item">
        <img src={DetailImage} className="img-fluid" alt="Parking view 2" />
      </div>
    </div>
  </div>
);

const BookingDetail: React.FC = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [item, setItem] = useState<ParkingItem | null>(null);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [markers, setMarkers] = useState<any>(null);

  const [formData, setFormData] = useState<FormData>({
    from: new Date(),
    to: new Date(),
    vehicle_type: "SUV",
    selectedFromTime: "01:00 AM",
    selectedToTime: "02:00 AM",
  });

  const [error, setError] = useState<FormErrors>({
    from: "",
    to: "",
    no_of_vehicle: "",
    hours: "",
    vehicle_type: "",
  });

  // Redux
  const searchRedux = useSelector((state: any) => state.search.value) as SearchState;

  // Google Maps
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
  });

  // Utility Functions
  const onChange = useCallback((name: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(prev => ({ ...prev, [name]: "" }));
  }, []);

  const dateTimeCalculation = useCallback((date: Date, time: string) => {
    const fromDate = moment(date).format('YYYY-MM-DD');
    const fromDateTime = moment(fromDate + ' ' + time, 'YYYY-MM-DD hh:mm A');
    const toDate = moment(formData.to).format('YYYY-MM-DD');
    let toDateTime = moment(toDate + ' ' + formData.selectedToTime, 'YYYY-MM-DD hh:mm A');

    if (toDateTime.isSameOrBefore(fromDateTime, 'minute')) {
      toDateTime = fromDateTime.clone().add(1, 'hour');
    }
    if (toDateTime.isBefore(fromDateTime, 'day')) {
      toDateTime.day(fromDateTime.day());
      toDateTime.month(fromDateTime.month());
      toDateTime.year(fromDateTime.year());
    }

    setFormData(prev => ({
      ...prev,
      from: fromDateTime.toDate(),
      to: toDateTime.toDate(),
      selectedFromTime: fromDateTime.format('hh:mm A'),
      selectedToTime: toDateTime.format('hh:mm A'),
    }));
  }, [formData.to, formData.selectedToTime]);

  const checkAvailability = useCallback(async (): Promise<boolean> => {
    if (!item) return false;
    
    try {
      const { data, status } = await AxiosClient.post("/api/getParkingSpotsByLocation", {
        from_datetime: combineDateTime(formData.from.toISOString(), formData.selectedFromTime),
        to_datetime: combineDateTime(formData.to.toISOString(), formData.selectedToTime),
        latitude: item.latitude,
        longitude: item.longitude,
        spot_id: item.id
      });
      return status === 200 && data.length > 0;
    } catch (error) {
      console.error("Error checking availability:", error);
      return false;
    }
  }, [item, formData]);

  // Event Handlers
  const handleFromDateChange = useCallback((date: Date) => {
    dateTimeCalculation(date, formData.selectedFromTime);
  }, [dateTimeCalculation, formData.selectedFromTime]);

  const handleFromTimeChange = useCallback((time: string) => {
    dateTimeCalculation(formData.from, time);
  }, [dateTimeCalculation, formData.from]);

  const handleToDateChange = useCallback((date: Date) => {
    if (date < formData.from) {
      setFormData(prev => ({ ...prev, to: prev.from }));
    } else {
      setFormData(prev => ({ ...prev, to: date }));
    }
  }, [formData.from]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.to < formData.from) {
      setError(prev => ({ ...prev, to: "To date cannot be less than the from date" }));
      return;
    }

    setError(prev => ({ ...prev, to: "" }));

    const isoFormData = {
      ...formData,
      from: formData.from.toISOString(),
      to: formData.to.toISOString(),
    };

    dispatch(searchSubmit({ data: isoFormData }));

    setLoading(true);
    const isAvailable = await checkAvailability();

    if (isAvailable) {
      navigate(`/review-booking/${item?.id}`);
    } else {
      setLoading(false);
      toast.warning("The spot is not available on the selected slot.");
    }
  }, [formData, item, checkAvailability, dispatch, navigate]);

  // Effects
  useEffect(() => {
    if (searchRedux.selectedFromTime && searchRedux.selectedToTime) {
      setFormData(prev => ({
        ...prev,
        from: searchRedux.from,
        to: searchRedux.to,
        selectedFromTime: searchRedux.selectedFromTime,
        selectedToTime: searchRedux.selectedToTime
      }));
    }
  }, [searchRedux]);

  useEffect(() => {
    if (!params?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, status } = await AxiosClient.get(`/api/booking-detail/${params.id}`);
        if (status === 200) {
          setItem(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id]);

  useEffect(() => {
    if (item) {
      setMarkers({
        id: item.id,
        name: item.slot_name,
        position: {
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
        },
      });
    }
  }, [item]);

  useEffect(() => {
    if (formData.from && formData.to && formData.selectedFromTime && formData.selectedToTime) {
      const fromTimeWithoutSpace = formData.selectedFromTime.replace(/\s/g, "");
      const toTimeWithoutSpace = formData.selectedToTime.replace(/\s/g, "");

      const totalDuration = calculateTotalDuration(
        formatDateYear(formData.from.toISOString()),
        fromTimeWithoutSpace,
        formatDateYear(formData.to.toISOString()),
        toTimeWithoutSpace
      );
      setTotalHours(totalDuration);
    }
  }, [formData]);

  // Render
  if (loading) {
    return (
      <div className="row" style={{ height: "500px", marginLeft: "48%", display: "flex", alignItems: "center" }}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <BreadCrumbs title="Parking Spot Details" />
      
      <div className="detailsOuter">
        <div className="container">
          <div className="card">
            {item ? (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Image Section */}
                  <div className="col-lg-4 col-md-12">
                    <div className="viewdetailImage">
                      <ImageCarousel item={item} />
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="col-lg-4 col-md-12">
                    <div className="detailsRight1">
                      <br />
                      <h3>
                        <a>{item.slot_name}</a>
                      </h3>

                      <div className="shortDescp">
                        <p>{item.nearby_places || ""}</p>
                      </div>

                      <div className="row">
                        <div className="form-group mb-3 col-lg-12 col-md-12">
                          <label>From<span className="text-danger">*</span></label>
                          <div className="picker">
                            <DatePicker
                              minDate={new Date()}
                              selected={formData.from}
                              customInput={<CustomDatePickerInput value="" onClick={() => {}} />}
                              onChange={(date) => handleFromDateChange(date as Date)}
                            />
                            <TimeSelector
                              value={formData.selectedFromTime}
                              onChange={handleFromTimeChange}
                            />
                          </div>
                        </div>

                        <div className="form-group mb-3 col-lg-12 col-md-12">
                          <label>To<span className="text-danger">*</span></label>
                          <div className="picker">
                            <DatePicker
                              minDate={new Date(formData.from)}
                              selected={formData.to}
                              customInput={<CustomDatePickerInput value="" onClick={() => {}} />}
                              onChange={(date) => handleToDateChange(date as Date)}
                            />
                            <TimeSelector
                              value={formData.selectedToTime}
                              onChange={(value) => onChange("selectedToTime", value)}
                            />
                          </div>
                          {error.to && (
                            <span className="text-danger small">{error.to}</span>
                          )}
                        </div>
                      </div>

                      <div className="detailContinueButton">
                        <div>Parking Fees = ${item.vehicle_fees}/hr</div>
                        <div>Total Duration = {totalHours} Hours</div>
                        <p>
                          <strong>Total Cost = ${totalHours * item.vehicle_fees}</strong>
                        </p>
                      </div>

                      <div className="detailContinueButton mt-4">
                        <button type="submit" className="btn btn-primary">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Street View Section */}
                  <div className="col-lg-4 col-md-12">
                    {isLoaded && markers && (
                      <div className="street-view">
                        <Streetview
                          apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}
                          streetViewPanoramaOptions={{
                            position: { lat: markers.position.lat, lng: markers.position.lng },
                            pov: { heading: 0, pitch: 0 },
                            zoom: 1,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            ) : (
              <div className="row">
                <h2>No data found!!</h2>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default BookingDetail;



// import { useNavigate, useParams } from "react-router-dom";
// import DetailImage from "../../assets/images/detailimage.jpg";
// import DetailImage1 from "../../assets/images/detailimage1.jpg";
// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import React, { useEffect, useState } from "react";
// import AxiosClient from "../../axios/AxiosClient";
// import Loader from "../../components/Loader";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import { useDispatch } from "react-redux";
// import { calculateTotalDuration, formatDateYear, combineDateTime } from "../../utils/DateTime";
// import DatePicker from "react-datepicker";
// import { useSelector } from "react-redux";
// import Streetview from 'react-google-streetview';
// import {
//   GoogleMap,
//   InfoWindow,
//   Marker,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { searchSubmit } from "../../redux/searchSlice";
// import { useLocation } from "react-router-dom";
// import moment from "moment";
// import { toast } from "react-toastify";

// const BookingDetail = () => {
//   const { state } = useLocation();
//   const dispatch = useDispatch();
//   const params = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [item, setItem] = useState(null);
//   const [totalHours, setTotalHours] = useState(null);
//   const [activeMarker, setActiveMarker] = useState(null);
//   const [map, setMap] = useState(null); // To access map instance
//   const [markers, setMarkers] = useState([]);


//   const searchRedux = useSelector((state) => {
//     return state.search.value;
//   });

//   const toggleExpansion = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const [formData, setFormData] = useState({
//     from: new Date(),
//     to: new Date(),
//     // from: "",
//     // to: "",

//     // no_of_vehicle: "1",
//     // hours: "1",
//     vehicle_type: "SUV",
//     selectedFromTime: "01:00 AM",
//     selectedToTime: "02:00 AM",
//   });

//   const [error, setError] = useState({
//     from: "",
//     to: "",
//     no_of_vehicle: "",
//     hours: "",
//     vehicle_type: "",
//   });

//   const onChange = (name, value) => {
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     // Reset error message for the field
//     setError({
//       ...error,
//       [name]: "",
//     });
//   };

//   useEffect(() => {
//     if (searchRedux.selectedFromTime != '' && searchRedux.selectedToTime != '') {
//       setFormData({
//         ...formData,
//         from: searchRedux.from,
//         to: searchRedux.to,
//         selectedFromTime: searchRedux.selectedFromTime,
//         selectedToTime: searchRedux.selectedToTime
//       })
//     }
//     if (params) {
//       const getApi = async () => {
//         try {
//           setLoading(true); // Set loading state to true when fetching data

//           const { data, status } = await AxiosClient.get(
//             `/api/booking-detail/${params.id}`
//           );
//           if (status === 200) {
//             setItem(data);
//           }
//         } catch (error) {
//           console.error("Error fetching data from the API:", error);
//         } finally {
//           setLoading(false); // Set loading state to false when fetching is done
//         }
//       };

//       getApi();
//     }
//   }, []);

//   // const handleNoOfVehiclesChange = (e) => {
//   //   setSelectedNoOfVehicles(e.target.value);
//   //   // You can call your existing onChange function here if needed
//   //   onChange("no_of_vehicle", e.target.value);
//   // };

//   // Render input fields based on the selected number of vehicles
//   // In the renderInputFields function
//   // const renderInputFields = () => {
//   //   const inputs = [];
//   //   for (let i = 0; i < parseInt(selectedNoOfVehicles); i++) {
//   //     inputs.push(
//   //       <div className="form-group mb-3 col-lg-6 col-md-6" key={i}>
//   //         <label>{`Enter Vehicle Number ${i + 1}`}</label>
//   //         <input
//   //           type="text"
//   //           className="form-control style-2 border-right"
//   //           value={formData[`vehicle_number_${i}`] || ""}
//   //           onChange={(e) => onChange(`vehicle_number_${i}`, e.target.value)}
//   //           required
//   //         />
//   //       </div>
//   //     );
//   //   }
//   //   return inputs;
//   // };

//   const checkAvaliability = async () => {
//       const { data, status } = await AxiosClient.post(
//         "/api/getParkingSpotsByLocation",
//         {
//           from_datetime: combineDateTime(
//             formData.from,
//             formData.selectedFromTime
//           ),
//           to_datetime: combineDateTime(
//             formData.to,
//             formData.selectedToTime
//           ),
//           latitude: item.latitude,
//           longitude: item.longitude,
//           spot_id: item.id
//         }
//       );

//       return status === 200 && data.length > 0;
//   }
//   const handleSubmit = async (e) => {
//     let isoFormData;
//     e.preventDefault();

//     if (formData.to < formData.from) {
//       setError({
//         ...error,
//         to: "To date cannot be less than the from date",
//       });
//       return; // Prevent form submission if validation fails
//     } else {
//       setError({
//         ...error,
//         to: "", // Clear the error message if validation passes
//       });
//     }

//     const fromDate = typeof formData.from;
//     const toDate = typeof formData.to;

//     isoFormData = {
//       ...formData, // Spread the remaining data in formData
//       from: fromDate != 'string' ? formData.from.toISOString() : formData.from, // Override from with ISO string format
//       to: toDate != 'string' ? formData.to.toISOString() : formData.to, // Override to with ISO string format
//     };

//     dispatch(
//       searchSubmit({
//         data: {
//           ...isoFormData, // Spread isoFormData into the searchSubmit data
//         },
//       })
//     );

//     setLoading(true);
//     const isAvailable = await checkAvaliability(isoFormData);

//     if (isAvailable) {
//         navigate(`/review-booking/${item.id}`);
//     } else {
//         setLoading(false);
//         toast.warning("The spot is not available on the selected slot.");
//     }
//   };
//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   console.log("save time", formData.selectedFromTime);
//   //   // Set booking details to localStorage
//   //   if (
//   //     searchState.from &&
//   //     searchState.to &&
//   //     searchState.selectedFromTime &&
//   //     searchState.selectedToTime
//   //   ) {
//   //     localStorage.setItem("from", searchState.from);
//   //     localStorage.setItem("to", searchState.to);
//   //     localStorage.setItem("from_time", searchState.selectedFromTime);
//   //     localStorage.setItem("to_time", searchState.selectedToTime);
//   //     localStorage.setItem("no_of_vehicle", formData.no_of_vehicle);

//   //     // Retrieve and set vehicle numbers to localStorage
//   //     const vehicleNumbers = [];
//   //     for (let i = 0; i < parseInt(formData.no_of_vehicle); i++) {
//   //       const vehicleNumber = formData[`vehicle_number_${i}`];
//   //       if (vehicleNumber.trim() !== "") {
//   //         vehicleNumbers.push(vehicleNumber.trim());
//   //       }
//   //     }
//   //     localStorage.setItem("vehicle_numbers", JSON.stringify(vehicleNumbers));
//   //     localStorage.setItem("hours", totalHours);
//   //     localStorage.setItem("vehicle_fees", item.vehicle_fees);
//   //     localStorage.setItem("parking_id", item.id);
//   //     navigate("/review-booking");
//   //   } else {
//   //     localStorage.setItem("from", formData.from);
//   //     localStorage.setItem("to", formData.to);
//   //     localStorage.setItem("from_time", formData.selectedFromTime);
//   //     localStorage.setItem("to_time", formData.selectedToTime);
//   //     localStorage.setItem("no_of_vehicle", formData.no_of_vehicle);

//   //     // Retrieve and set vehicle numbers to localStorage
//   //     const vehicleNumbers = [];
//   //     for (let i = 0; i < parseInt(formData.no_of_vehicle); i++) {
//   //       const vehicleNumber = formData[`vehicle_number_${i}`];
//   //       if (vehicleNumber.trim() !== "") {
//   //         vehicleNumbers.push(vehicleNumber.trim());
//   //       }
//   //     }
//   //     localStorage.setItem("vehicle_numbers", JSON.stringify(vehicleNumbers));
//   //     localStorage.setItem("hours", totalHours);
//   //     localStorage.setItem("vehicle_fees", item.vehicle_fees);
//   //     localStorage.setItem("parking_id", item.id);

//   //     navigate("/review-booking");
//   //   }
//   // };

//   const CustomDatePickerInput = ({ value, onClick }) => (
//     <>
//       <div className="input-group date picker-date" id="datepicker">
//         <input
//           type="text"
//           className="form-control style-2 border-right"
//           value={value}
//           onClick={onClick}
//           placeholder="Date"
//         />
//         <span className="input-group-append" onClick={onClick}>
//           <span className="input-group-text bg-white d-block">
//             <i className="fa fa-calendar"></i>
//           </span>
//         </span>
//       </div>
//     </>
//   );

//   useEffect(() => {
//     let totalDuration = 0;
//     if (
//       formData.from !== "" &&
//       formData.to !== "" &&
//       formData.selectedFromTime !== "" &&
//       formData.selectedToTime !== ""
//     ) {
//       let fromTimeWithoutSpace = formData.selectedFromTime.replace(/\s/g, "");
//       let toTimeWithoutSpace = formData.selectedToTime.replace(/\s/g, "");

//       totalDuration = calculateTotalDuration(
//         formatDateYear(formData.from),
//         fromTimeWithoutSpace,
//         formatDateYear(formData.to),
//         toTimeWithoutSpace
//       );
//     }
//     setTotalHours(totalDuration);
//   }, [formData]);

//   // google map
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
//   });

//   const handleActiveMarker = (marker) => {
//     if (marker === activeMarker) {
//       return;
//     }
//     setActiveMarker(marker);
//   };

//   // Fit bounds to all markers whenever markers change
//   useEffect(() => {
//     if (map && markers.length > 0) {
//       const bounds = new window.google.maps.LatLngBounds();
//       markers.forEach(({ position }) => {
//         bounds.extend(position);
//       });
//       map.fitBounds(bounds);
//     }
//   }, [map, markers]);

//   useEffect(() => {
//     if (item) {
//       setMarkers({
//         id: item.id,
//         name: item.slot_name,
//         position: {
//           lat: parseFloat(item.latitude),
//           lng: parseFloat(item.longitude),
//         },
//       });
//     }
//   }, [item]);

//   const handleFromDateChange = (date) => {
//     dateTimeCalculation(date, formData.selectedFromTime)
//   };

//   const handleFromTimeChange = (time) => {
//     dateTimeCalculation(formData.from, time)
//   };

//   const dateTimeCalculation = (date, time) => {
//     const fromDate = moment(date).format('YYYY-MM-DD')
//     const fromDateTime = moment( fromDate+ ' ' + time, 'YYYY-MM-DD hh:mm A')
//     const toDate = moment(formData.to).format('YYYY-MM-DD')
//     let toDateTime = moment( toDate+ ' ' + formData.selectedToTime, 'YYYY-MM-DD hh:mm A')

//     if (toDateTime.isSameOrBefore(fromDateTime, 'minute')) {
//       toDateTime = fromDateTime.clone().add(1, 'hour')
//     }
//     if (toDateTime.isBefore(fromDateTime, 'day')) {
//       toDateTime.day(fromDateTime.day())
//       toDateTime.month(fromDateTime.month())
//       toDateTime.year(fromDateTime.year())
//     }

//     setFormData({
//       ...formData,
//       from: fromDateTime.toDate(),
//       to: toDateTime.toDate(),
//       selectedFromTime: fromDateTime.format('hh:mm A'),
//       selectedToTime: toDateTime.format('hh:mm A'),
//     });
//   }

//   const handleToDateChange = (date) => {
//     if (date < formData.from) {
//       setFormData({ ...formData, to: formData.from });
//     } else {
//       setFormData({ ...formData, to: date });
//     }
//   };

//   return (
//     <>
//       {/* <Header /> */}
//       <BreadCrumbs title="Parking Spot Details" />
//       {loading ? (
//         <div
//           className="row"
//           style={{
//             height: "500px",
//             marginLeft: "48%",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <Loader />
//         </div>
//       ) : (
//         <>
//           {item ? (
//             <div className="detailsOuter">
//               <div className="container">
//                 <div className="card">
//                   <form onSubmit={handleSubmit}>
//                     <div className="row">
//                       <div className="col-lg-4 col-md-12">
//                         <div className="viewdetailImage">
//                           {/* <span className="available">
//                             {item.available_slots} Available
//                           </span> */}

//                           <div
//                             id="carouselExampleFade"
//                             className="carousel slide carousel-fade"
//                           >
//                             <div className="carousel-inner">
//                               <div className="carousel-item active">
//                                 {item.photos &&
//                                   item.photos.length > 0 &&
//                                   item.photos[0].photo_path && (
//                                     <img
//                                       src={`${
//                                         import.meta.env.VITE_APP_BASE_URL
//                                       }/storage/${item.photos[0].photo_path.slice(
//                                         6
//                                       )}`}
//                                       className="img-fluid"
//                                     />
//                                   )}
//                               </div>
//                               <div className="carousel-item">
//                                 <img src={DetailImage1} className="img-fluid" />
//                               </div>
//                               <div className="carousel-item">
//                                 <img src={DetailImage} className="img-fluid" />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="col-lg-4 col-md-12">
//                         <div className="detailsRight1">
//                           <br />
//                           <h3>
//                             <a>{item.slot_name}</a>
//                           </h3>
//                           {/* <div className="location">
//                             1.5 km away, California
//                           </div> */}

//                           <div className="shortDescp">
//                             <p>
//                               {item.nearby_places || ""}
//                             </p>
//                             {/*{!isExpanded && (*/}
//                             {/*  <a*/}
//                             {/*    onClick={toggleExpansion}*/}
//                             {/*    className="cursor-pointer"*/}
//                             {/*  >*/}
//                             {/*    Read More*/}
//                             {/*  </a>*/}
//                             {/*)}*/}
//                             {/*{isExpanded && (*/}
//                             {/*  <a*/}
//                             {/*    onClick={toggleExpansion}*/}
//                             {/*    className="cursor-pointer"*/}
//                             {/*  >*/}
//                             {/*    Read Less*/}
//                             {/*  </a>*/}
//                             {/*)}*/}
//                           </div>

//                           <div className="row">
//                             <div className="form-group mb-3 col-lg-12 col-md-12">

//                               <label>
//                                 From<span className="text-danger">*</span>
//                               </label>
//                               <div className="picker">
//                                 <DatePicker
//                                   // key={searchState.from}
//                                   minDate={new Date()}
//                                   selected={formData.from}
//                                   customInput={<CustomDatePickerInput />}
//                                   onChange={handleFromDateChange}

//                                   // onChange={(date) =>
//                                   //   setFormData({ ...formData, from: date })
//                                   // }
//                                 />
//                                 <select
//                                   className="form-control style-2"
//                                   value={formData.selectedFromTime}
//                                   onChange={(e) =>
//                                     handleFromTimeChange(e.target.value)
//                                   }
//                                 >
//                                   {/* Populate options for time selection */}
//                                   {Array.from({ length: 24 }, (_, index) => {
//                                     const hour = index % 12 || 12; // Get hour in 12-hour format
//                                     const ampm = index < 12 ? "AM" : "PM"; // Determine AM or PM
//                                     const formattedHour = ("0" + hour).slice(
//                                       -2
//                                     ); // Ensure double-digit formatting
//                                     const formattedTime = `${formattedHour}:00 ${ampm}`; // Concatenate hour and AM/PM
//                                     return (
//                                       <option key={index} value={formattedTime}>
//                                         {formattedTime}
//                                       </option>
//                                     );
//                                   })}
//                                 </select>
//                               </div>
//                             </div>
//                             <div className="form-group mb-3 col-lg-12 col-md-12">
//                               <label>
//                                 To<span className="text-danger">*</span> &nbsp;
//                                 &nbsp;
//                               </label>
//                               <div className="picker">
//                                 <DatePicker
//                                   minDate={new Date(formData.from)}
//                                   selected={formData.to}
//                                   customInput={<CustomDatePickerInput />}
//                                   onChange={handleToDateChange}
//                                 />
//                                 <select
//                                   className="form-control style-2"
//                                   value={formData.selectedToTime}
//                                   onChange={(e) =>
//                                     onChange("selectedToTime", e.target.value)
//                                   }
//                                 >
//                                   {Array.from({ length: 24 }, (_, index) => {
//                                     const hour = index % 12 || 12; // Get hour in 12-hour format
//                                     const ampm = index < 12 ? "AM" : "PM"; // Determine AM or PM
//                                     const formattedHour = ("0" + hour).slice(
//                                       -2
//                                     ); // Ensure double-digit formatting
//                                     const formattedTime = `${formattedHour}:00 ${ampm}`; // Concatenate hour and AM/PM
//                                     return (
//                                       <option key={index} value={formattedTime}>
//                                         {formattedTime}
//                                       </option>
//                                     );
//                                   })}
//                                 </select>
//                               </div>
//                               {error.to && (
//                                 <span className="text-danger small">
//                                   {error.to}
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           <div className="detailContinueButton">
//                             <div>Parking Fees = ${item.vehicle_fees}/hr</div>
//                             <div>Total Duration = {totalHours} Hours</div>
//                             <p>
//                               <strong>Total Cost = </strong>
//                               <strong>${totalHours * item.vehicle_fees}</strong>
//                             </p>
//                           </div>

//                           <div className="detailContinueButton mt-4">
//                             <button type="submit" className="btn btn-primary  ">
//                               Book Now
//                             </button>
//                           </div>
//                         </div>
//                         <br />
//                       </div>
//                       <div className="col-lg-4 col-md-12">
//                         {/*<div className="reviewDetails">*/}
//                           {isLoaded && (
//                               <div className="street-view">
//                                 <Streetview
//                                     apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}
//                                     streetViewPanoramaOptions={{
//                                       position: {lat: markers?.position?.lat, lng: markers?.position?.lng},
//                                       pov: {heading: 0, pitch: 0},
//                                       zoom: 1,
//                                     }}
//                                 />
//                               </div>
//                           )}
//                         {/*</div>*/}
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           ) : (
//               <div className="detailsOuter">
//                 <div className="container">
//                   <div className="card">
//                     <div className="row">
//                       <h2>No data found!!</h2>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//           )}
//         </>
//       )}
//       <Footer />
//     </>
//   );
// };

// export default BookingDetail;
