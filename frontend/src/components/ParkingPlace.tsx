import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ListImg from "../assets/images/listimage.jpg";
import AxiosClient from "../axios/AxiosClient";
import Slider from "react-slick";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { searchSubmit } from "../redux/searchSlice";
import { useDispatch } from "react-redux";

const ParkingPlace = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [parkingListData, setParkingListData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getApi();
  }, []);

  const getApi = async () => {
    setParkingListData([]);
    setError(null);
    try {
      setLoading(true);
      await AxiosClient.get("/sanctum/csrf-cookie");
      const { data, status } = await AxiosClient.get("/api/getParkingSpots");
      if (status === 200) {
        console.log("Response parking data UI", data);
        setParkingListData(data);
      }
    } catch (error) {
      setError("Internal Server Error");
      console.error("Error fetching data from the API:", error);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const convertDateTimeFormat = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateFutureTimeList = (date: Date, type: string): string[] => {
    const times: string[] = [];
    const currentDateFormat = convertDateTimeFormat(new Date());
    const dateFormat = convertDateTimeFormat(date);
    const now = new Date(date);

    if (currentDateFormat === dateFormat && type === 'from') {
      now.setHours(now.getHours() + 1);
    }

    now.setMinutes(0, 0, 0);
    const currentHour = now.getHours();

    for (let i = currentHour; i < 24; i++) {
      let hours = i;
      const minutes = '00';
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hoursStr = hours < 10 ? '0' + hours : hours.toString();
      const timeStr = `${hoursStr}:${minutes} ${ampm}`;
      times.push(timeStr);
    }

    return times;
  };

  const handleClick = (data: any) => {
    const currentDate = new Date();
    const fromDate = new Date(currentDate);
    const toDate = new Date(currentDate);
    fromDate.setHours(fromDate.getHours() + 1);
    toDate.setHours(toDate.getHours() + 2);

    const fromTime = generateFutureTimeList(new Date(), 'from');

    dispatch(
      searchSubmit({
        data: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
          selectedFromTime: fromTime[0],
          selectedToTime: fromTime[1],
        },
      })
    );

    navigate(`/booking-detail/${data.id}`, { state: data });
  };

  return (
    <div className="slider-container">
      <div className="container searchOuter">
        <h2>Who we are</h2>
        <p style={{ textAlign: "center" }}>
          Park in My Driveway is the innovative idea that's revolutionizing the
          way people park. Imagine a visitor to a concert booking your driveway
          ahead of time, parking with ease, and leaving without getting stuck
          in traffic. The convenience and seamless customer experience alone are
          worth the cost of parking.
        </p>

        {loading ? (
          <div
            style={{
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader />
          </div>
        ) : (
          <Slider {...settings}>
            {parkingListData
              .filter((data) => data.status === 0)
              .map((item) => (
                <div key={item.id} className="slider-slot-padding">
                  <div className="newsItemBlock card homecard">
                    <div className="listImage">
                      <a>
                        <img
                          style={{ width: "500px", height: "200px" }}
                          src={
                            item.photos?.length
                              ? `${import.meta.env.VITE_APP_BASE_URL}/storage/${item.photos[0]?.photo_path?.slice(6)}`
                              : "https://placehold.co/500x300.png"
                          }
                          className="img-fluid"
                          alt={item.slot_name || "Parking Slot"}
                        />
                      </a>
                    </div>
                    <div className="listingContent">
                      <h3><a>{item.slot_name}</a></h3>
                      <div className="location">{item.google_map}</div>
                      <div className="time">
                        Available Time Slot: {item.available_time}
                      </div>
                      <div className="listingBottom">
                        <strong>$ {item.vehicle_fees}/hr</strong>
                        <a
                          onClick={() => handleClick(item)}
                          className="btn btn-outline-primary"
                          role="button"
                        >
                          Book Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default ParkingPlace;












// import { useEffect, useRef, useState } from "react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import ListImg from "../assets/images/listimage.jpg";
// import AxiosClient from "../axios/AxiosClient";
// import Slider from "react-slick";
// import Loader from "./Loader";
// import { useNavigate } from "react-router-dom";
// import { searchSubmit } from "../redux/searchSlice";
// import { useDispatch } from "react-redux";

// const ParkingPlace = () => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [parkingListData, setParkingListData] = useState([]);

//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getApi();
//     // fetchPhoto();
//   }, []);

//   const getApi = async () => {
//     setParkingListData([]);
//     setError(null);
//     try {
//       setLoading(true); // Set loading state to true when fetching data
//       await AxiosClient.get("/sanctum/csrf-cookie");
//       const { data, status } = await AxiosClient.get("/api/getParkingSpots");
//       if (status === 200) {
//         console.log("Response parking data UI", data);
//         setParkingListData(data);
//       }
//     } catch (error) {
//       setError("Internal Server Error");
//       console.error("Error fetching data from the API:", error);
//     } finally {
//       setLoading(false); // Set loading state to false when fetching is done
//     }
//   };
//   console.log(window.innerWidth);
//   const settings = {
//     dots: false,
//     infinite: true,
//     slidesToShow: 3, 
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     responsive: [
     
//       {
//         breakpoint: 767, 
//         settings: {
//           slidesToShow: 1, 
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 992, 
//         settings: {
//           slidesToShow: 2, 
//           slidesToScroll: 1,
//         },
//       },
//     ],
//   };
//   const convertDateTimeFormat = (date) => {
//     const currentDate = new Date();

//     // Extract the year, month, and day
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');

//     // Convert to string in the format YYYY-MM-DD
//     const currentDateString = `${year}-${month}-${day}`;
//     return currentDateString;
//   }

//   const generateFutureTimeList = (date, type) => {
//     const times = [];
//     const currentDateFormat = convertDateTimeFormat(new Date());
//     const dateFormat = convertDateTimeFormat(date);
//     // Round to the next hour
//     const now = new Date(date);
//     if ((currentDateFormat == dateFormat) && type == 'from' ) {
//       now.setHours(now.getHours() + 1);
//     }
//     now.setMinutes(0, 0, 0);
//     const currentHour = now.getHours();

//     for (let i = currentHour; i < 24; i++) {
//       let hours = i;
//       const minutes = '00';
//       const ampm = hours >= 12 ? 'PM' : 'AM';

//       hours = hours % 12;
//       hours = hours ? hours : 12; // the hour '0' should be '12'
//       const hoursStr = hours < 10 ? '0' + hours : hours;

//       const timeStr = hoursStr + ':' + minutes + ' ' + ampm;
//       times.push(timeStr);
//     }
//     return times;
//   };

//   const handleClick = (data) => {
//     const currentDate = new Date();
//     const fromDate = new Date(currentDate);
//     const toDate = new Date(currentDate);
//     fromDate.setHours(fromDate.getHours() + 1);
//     toDate.setHours(toDate.getHours() + 2);
//     const fromTime = generateFutureTimeList(new Date(), 'from')
// debugger
//     dispatch(
//       searchSubmit({
//         data: {
//           from: fromDate,
//           to: toDate,
//           selectedFromTime: fromTime[0],
//           selectedToTime: fromTime[1]
//         },
//       }))
//     navigate(`/booking-detail/${data.id}`, { state: data });
//     // navigate(`/review-booking/${id}`);
//     // navigate(`/find-economy-parking`);
//   };

  

//   return (
//     <>
//       <div className="slider-container">
//         <div className="container searchOuter">
//           <h2>Who we are</h2>
//           <p style={{textAlign:"center"}}>Park in My Driveway is the innovative idea that's revolutionizing the way people park. Imagine a visitor to a concert booking your driveway ahead of time, parking with ease, and leaving without getting stuck in traffic. The convenience and seamless customer experience alone are worth the cost of parking.</p>
//           {loading ? (
//             <div
//               style={{
//                 height: "300px",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Loader />
//             </div>
//           ) : (
//             <Slider {...settings}>
//             {parkingListData && parkingListData
//               .filter((data) => data.status === 0)
//               .map((item) => (
//                 <div key={item.id} className="slider-slot-padding">
//                   <div className="newsItemBlock card homecard">
//                     <div className="listImage">
//                       <a>
//                         <img
//                           style={{ width: "500px", height: "200px" }}
//                           src={
//                             item.photos && item.photos.length
//                               ? `${import.meta.env.VITE_APP_BASE_URL}/storage/${item.photos[0]?.photo_path?.slice(6)}`
//                               : 'https://placehold.co/500x300.png'
//                           }
//                           className="img-fluid"
//                           alt="Earning Passive Income"
//                         />
//                       </a>
//                     </div>
//                     <div className="listingContent">
//                       <h3><a>{item.slot_name}</a></h3>
//                       <div className="location">{item.google_map}</div>
//                       <div className="time">Available Time Slot: {item.available_time}</div>
//                       <div className="listingBottom">
//                         <strong>$ {item.vehicle_fees}/hr</strong>
//                         <a onClick={() => handleClick(item)} className="btn btn-outline-primary">
//                           Book Now
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </Slider>
//           )}
//           {/* <div className="mt-5 text-center">
//             <a
//               onClick={() => handleParkingList(parkingListData)}
//               className="btn btn-primary"
//             >
//               View all parking Slots
//             </a>
//           </div> */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ParkingPlace;
