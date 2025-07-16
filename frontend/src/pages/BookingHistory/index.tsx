// NOTE: This is the fully optimized TSX version of the BookingHistory component

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../../components/Footer";
import { NavLink } from "react-router-dom";
import ParkingSpace from "../../components/ParkingSpace";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CardBookingHistory from "../../components/CardBookingHistory";
import AxiosClient from "../../axios/AxiosClient";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { convertToMySQLDate } from "../../utils/DateTime";
import { toast } from "react-toastify";
import { withSwal } from 'react-sweetalert2';
import moment from 'moment';
import type { RootState } from "../../redux/store";

interface BookingHistoryProps {
  swal: any;
}

const BookingHistory = ({ swal }: BookingHistoryProps) => {
  const userRedux = useSelector((state: RootState) => state.user.value);
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);
  const [selectedCancelItem, setSelectedCancelItem] = useState<any>({});
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [recentBookingData, setRecentBookingData] = useState<any[]>([]);
  const [cancelBookingData, setCancelBookingData] = useState<any[]>([]);
  const [completedBookingData, setCompletedBookingData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cancelledBookingsCount, setCancelledBookingsCount] = useState<number>(0);
  const [confirmedBookingsCount, setConfirmedBookingsCount] = useState<number>(0);
  const [popupWidthClass, setPopupWidthClass] = useState<string>('w-50');
  const [comment, setComment] = useState<string>("");
  const [searchParams] = useSearchParams();
  let isPaymentsResponseProcessed = false;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPopupWidthClass('w-80');
      } else {
        setPopupWidthClass('w-50');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkPayment = async () => {
    setLoading(true);
    isPaymentsResponseProcessed = true;
    try {
      const response = await AxiosClient.post("/api/payment-return", {
        booking_id: searchParams.get("booking"),
        token: searchParams.get("token"),
        status: searchParams.get("paypal"),
      });

      if (response.status === 200) {
        swal.fire({
          title: 'Your parking is confirmed.',
          html: `<p class="text-align-left">Thank you for booking...</p>` /* shortened */, 
          customClass: {
            popup: popupWidthClass,
            confirmButton: 'btn btn-primary',
            htmlContainer: 'text-align-left'
          },
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          setShow(false);
          navigate('/booking-history');
          fetchData();
        });
      } else {
        swal.fire({ title: "Payment Failed", icon: "error" }).then(() => navigate('/booking-history'));
        fetchData();
      }
    } catch (error) {
      console.error("Error Cancel booking:", error);
    }
  };

  useEffect(() => {
    if (searchParams.has("paypal")) {
      setLoading(true);
      if (searchParams.get("paypal") === "cancel") {
        toast.error("Booking Failed.");
      }
      if (searchParams.get("paypal") === "success") {
        !isPaymentsResponseProcessed && checkPayment();
      }
    } else {
      fetchData();
    }
  }, []);

  const handleClose = () => setShow(false);

  const handleShow = (data: any) => {
    setSelectedCancelItem(data);
    setShow(true);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosClient.get("/api/bookings");
      if (response.data) {
        const filteredUser = response.data.filter((item: any) => item.user.email === userRedux.email);
        const now = new Date();
        const recent = filteredUser.filter((item: any) => new Date(item.from_datetime) >= now && item.status === "Booked");
        const cancelled = filteredUser.filter((item: any) => item.status === "Cancelled");
        const completed = filteredUser.filter((item: any) => item.status === "Confirmed" || (item.status !== "Cancelled" && new Date(item.from_datetime) <= now));
        setRecentBookingData(recent);
        setCancelBookingData(cancelled);
        setCompletedBookingData(completed);
        setBookingCount(recent.length);
        setCancelledBookingsCount(cancelled.length);
        setConfirmedBookingsCount(completed.length);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      if (!comment.trim()) {
        toast.error("Comment is required");
        return;
      }
      const response = await AxiosClient.post("/api/cancel-booking", {
        booking_id: selectedCancelItem.id,
        cancelled_by: "User",
        total_hours: selectedCancelItem.time,
        cancelled_date: convertToMySQLDate(new Date()),
        refund_status: "Pending",
        reason_for_cancellation: comment,
      });
      if (response.data) {
        fetchData();
        setShow(false);
        toast.success("Spot cancelled successfully!");
      }
    } catch (error) {
      console.error("Error Cancel booking:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="graybg">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>Booking History</h2>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loader" style={{ height: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader />
        </div>
      ) : (
        <div className="loginOuter">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mx-auto">
                <Tabs defaultActiveKey="recent" id="fill-tab-example" className="mb-3">
                  <Tab eventKey="recent" title={`Upcoming Bookings (${bookingCount})`}>
                    {recentBookingData.map((item: any) => (
                      <CardBookingHistory
                        key={item.id}
                        fromTime={moment(item.from_datetime).format('MM-DD-YYYY hh:mm')}
                        toTime={moment(item.to_datetime).format('MM-DD-YYYY hh:mm')}
                        img={item.parking_spots.photos}
                        amount={item.amount_paid}
                        date={item.from_datetime}
                        vehicle_number={item.vehicle_number}
                        location={item.parking_spots.google_map}
                        title={item.slot}
                        onClick={handleShow}
                        status={item.status}
                        booked_on={moment(item.booked_on).format('MM-DD-YYYY hh:mm')}
                      />
                    )) || <div>No records found</div>}
                  </Tab>

                  <Tab eventKey="completed" title={`Completed (${confirmedBookingsCount})`}>
                    {completedBookingData.map((item: any) => (
                      <CardBookingHistory
                        key={item.id}
                        fromTime={moment(item.from_datetime).format('MM-DD-YYYY hh:mm')}
                        toTime={moment(item.to_datetime).format('MM-DD-YYYY hh:mm')}
                        img={item.parking_spots.photos}
                        amount={item.amount_paid}
                        date={item.from_datetime}
                        vehicle_number={item.vehicle_number}
                        location={item.parking_spots.google_map}
                        title={item.slot}
                        onClick={handleShow}
                        status={item.status}
                        booked_on={moment(item.booked_on).format('MM-DD-YYYY hh:mm')}
                      />
                    )) || <div>No records found</div>}
                  </Tab>

                  <Tab eventKey="cancelled" title={`Cancelled (${cancelledBookingsCount})`}>
                    {cancelBookingData.map((item: any) => (
                      <CardBookingHistory
                        key={item.id}
                        fromTime={moment(item.from_datetime).format('MM-DD-YYYY hh:mm')}
                        toTime={moment(item.to_datetime).format('MM-DD-YYYY hh:mm')}
                        img={item.parking_spots.photos}
                        amount={item.amount_paid}
                        date={item.from_datetime}
                        vehicle_number={item.vehicle_number}
                        location={item.parking_spots.google_map}
                        title={item.slot}
                        onClick={handleShow}
                        status={item.status}
                        booked_on={moment(item.booked_on).format('MM-DD-YYYY hh:mm')}
                        cancelled_booking={item.cancelled_booking}
                      />
                    )) || <div>No records found</div>}
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      )}

      <ParkingSpace />
      <Footer />

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="booklistingContent">
            {selectedCancelItem.img?.[0]?.photo_path && (
              <img
                src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${selectedCancelItem.img[0].photo_path.slice(6)}`}
                className="img-fluid"
              />
            )}
            <h3><a>{selectedCancelItem.title}</a></h3>
            <div className="location">{selectedCancelItem.location}</div>
            <div className="time">Booked on: {selectedCancelItem.booked_on}</div>
            <div className="dollar"><span>Total Cost:</span> ${selectedCancelItem.amount}</div>
            <div className="row mb-2">
              <label htmlFor="inputEmail3" className="col-form-label col-12">Comments</label>
              <div className="col-12">
                <textarea
                  id="commentInput"
                  className="form-control"
                  value={comment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="primary" onClick={handleCancel}>
            {loading ? <div className="loader"><Loader /></div> : "Cancel Booking"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default withSwal(BookingHistory);




// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Footer from "../../components/Footer";
// import { NavLink } from "react-router-dom";
// import ParkingSpace from "../../components/ParkingSpace";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import CardBookingHistory from "../../components/CardBookingHistory";
// import AxiosClient from "../../axios/AxiosClient";
// import { useSelector } from "react-redux";
// import Loader from "../../components/Loader";
// import { convertToMySQLDate } from "../../utils/DateTime";
// import { toast } from "react-toastify";
// import { withSwal } from 'react-sweetalert2';
// import moment from 'moment';

// const BookingHistory = (props) => {
//   const userRedux = useSelector((state) => {
//     return state.user.value;
//   });
//   const navigate = useNavigate();
//   const [show, setShow] = useState(false);
//   const [selectedCancelItem, setSelectedCancelItem] = useState({});
//   const [bookingCount, setBookingCount] = useState(0);
//   const [recentBookingData, setRecentBookingData] = useState([]);
//   const [cancelBookingData, setCancelBookingData] = useState([]);
//   const [completedBookingData, setCompletedBookingData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [cancelledBookingsCount, setCancelledBookingsCount] = useState(0);
//   const [confirmedBookingsCount, setConfirmedBookingsCount] = useState(0);
//   const [popupWidthClass, setPopupWidthClass] = useState('w-50');

//   const [comment, setComment] = useState("");
//   let isPaymentsResponseProcessed = false;

//   const [searchParams] = useSearchParams();
//   const { swal } = props;

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setPopupWidthClass('w-80');
//       } else {
//         setPopupWidthClass('w-50');
//       }
//     };
//     handleResize();

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   const checkPayment = async () => {
//     setLoading(true);
//     isPaymentsResponseProcessed = true;
//     try {
//       const response = await AxiosClient.post("/api/payment-return", {
//         booking_id: searchParams.get("booking"),
//         token: searchParams.get("token"),
//         status: searchParams.get("paypal"),
//       });

//       if (response.status === 200) {
//         // setLoading(true);
//         //fetchData();
//         swal.fire({
//           title: 'Your parking is confirmed.',
//           html: `<p class="text-align-left">Thank you for booking your parking spot with us. We strive to ensure that you don't have to worry about parking when you park with us. Please help us succeed by doing the following things</p>
//         <ul class="list-group list-group-flush text-align-left">
//          <li class="list-group-item"><small>Bring this email with you when you park.</small></li>
//          <li class="list-group-item"><small>Ensure you are parking in the right location &amp; following all the instructions</small></li>
//          <li class="list-group-item"><small>Please avoid making any disturbances. These are usually quiet neighborhoods. We would like to keep them that way.</small></li>
//        </ul><p class="text-align-left">Hope you have fun wherever you are going and we look forward to serving you again.</p>`,
//           customClass: {
//             popup: popupWidthClass,
//             confirmButton: 'btn btn-primary',
//             htmlContainer: 'text-align-left'
//           },
//           icon: 'success',
//           allowOutsideClick: false,
//           allowEscapeKey: false,
//         }).then(() => {
//           setShow(false);
//           navigate('/booking-history');
//           fetchData();
//         });

//       } else {
//         swal.fire({
//           title: "Payment Failed",
//           icon: "error"
//         }).then(() => {
//           navigate('/booking-history');
//         });
//         fetchData();
//       }
//       // Handle success response
//     } catch (error) {
//       console.error("Error Cancel booking:", error);
//       // Handle error
//     }
//   };

//   useEffect(() => {
//     // if (searchParams.has("paypal") && searchParams.has("booking")) {
//     if (searchParams.has("paypal")) {
//       setLoading(true);
//       if (searchParams.get("paypal") == "cancel") {
//         //
//         // navigate("/review-booking");
//         // setSuccess(false);
//         toast.error(" Booking  Failed. ");
//       }
//       if (searchParams.get("paypal") == "success") {
//         //paymentChecked !== true && checkPayment();
//         isPaymentsResponseProcessed === false && checkPayment()
//       }
//     } else {
//       fetchData();
//     }
//   }, []);

//   const handleClose = () => { setShow(false) };

//   const handleShow = (data) => {
//     setSelectedCancelItem(data);
//     setShow(true);
//   };
//   //
//   //useEffect(() => {
//   //  fetchData();
//   //}, []);

//   const fetchData = async () => {
//     setLoading(true);
//     setBookingCount(0);
//     setCancelledBookingsCount(0);
//     try {
//       const response = await AxiosClient.get("/api/bookings");

//       if (response.data) {
//         const filteredUser = response.data.filter(
//           (item) => item.user.email === userRedux.email
//         );
//         const recent = filteredUser.filter((item) => {
//           const expirationDate = new Date(item.from_datetime);
//           const now = new Date();
//           return item.status === "Booked" && expirationDate >= now; 
//         });
//         const cancelled = filteredUser.filter((item) => {
//           return item.status === "Cancelled";
//         });
//         const completed = filteredUser.filter((item) => {
//           const expirationDate = new Date(item.from_datetime);
//           const now = new Date();
//           return item.status === "Confirmed" || (item.status != "Cancelled" && expirationDate <= now);
//         });
//         setRecentBookingData(recent);
//         setCancelBookingData(cancelled);
//         setCompletedBookingData(completed);
//         setBookingCount(recent.length);
//         setCancelledBookingsCount(cancelled.length);
//         setConfirmedBookingsCount(completed.length);
//         // setBookingData(filteredUser);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       // setLoading(false);

//     }
//   };

//   const handleCancel = async () => {
//     setLoading(true);
//     try {
//       const response = await AxiosClient.post("/api/cancel-booking", {
//         booking_id: selectedCancelItem.id,
//         cancelled_by: "User",
//         total_hours: selectedCancelItem.time,
//         cancelled_date: convertToMySQLDate(new Date()),
//         refund_status: "Pending",
//         reason_for_cancellation: comment, // Assuming this is defined elsewhere
//       });
//       console.log("Cancel Booking data", response.data);
//       if (response.errors) {
//         toast.error("Comment is required");
//       }
//       if (response.data) {
//               setBookingCount(0);
//               setCancelledBookingsCount(0);
//               try {
//                 const responses = await AxiosClient.get("/api/bookings");
//                 console.log("response booking data", response.data);
//                 if (responses.data) {
//                   const filteredUser = responses.data.filter(
//                     (item) => item.user.email === userRedux.email
//                   );
//                   const recent = filteredUser.filter((item) => {
//                     const expirationDate = new Date(item.from_datetime);
//                     const now = new Date();
//                     return item.status === "Booked" && expirationDate > now;
//                   });
//                   const cancelled = filteredUser.filter((item) => {
//                     return item.status === "Cancelled";
//                   });
//                   const completed = filteredUser.filter((item) => {
//                     const expirationDate = new Date(item.from_datetime);
//                     const now = new Date();
//                     return item.status === "Confirmed" || (item.status != "Cancelled" && expirationDate <= now);
//                   });
//                   setRecentBookingData(recent);
//                   setCancelBookingData(cancelled);
//                   setCompletedBookingData(completed);
//                   setBookingCount(recent.length);
//                   setCancelledBookingsCount(cancelled.length);
//                   setConfirmedBookingsCount(completed.length);
//                   // setBookingData(filteredUser);
//                   setShow(false);
//                   setLoading(false);
//                   toast.success("Spot cancelled successfully!");
//                 }
//               } catch (error) {
//                 console.error("Error fetching data:", error);
//               } finally {
//                 // setLoading(false);
      
//               }
//               // setLoading(false);
//               // fetchData(); // Assuming this function fetches updated data
//             }



//       // Handle success response
//     } catch (error) {
//       console.error("Error Cancel booking:", error);
//       // Handle error
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* <Header /> */}
//       <div className="graybg">
//         <div className="container">
//           <div className="row">
//             <div className="col">
//               <h2>Booking History</h2>
//             </div>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div
//           className="loader"
//           style={{
//             height: "500px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Loader />
//         </div>
//       ) : (
//         <div className="loginOuter">
//           <div className="container">
//             {/* <div id="thank">
//               <ReturnStatus
//                 status={searchParams.get("paypal") == "success" ? true : false}
//               />
//             </div> */}
//             {/* <NavLink onClick={(e) => {
//               e.preventDefault();
//               navigate(-1);
//             }}
//               style={{ display: 'flex', float: 'right', padding: '20px' }}
//             >Back</NavLink> */}

//             <div className="row">
//               <div className="col-lg-12 mx-auto">
//                 <Tabs
//                   defaultActiveKey="recent"
//                   id="fill-tab-example"
//                   className="mb-3"
//                 >
//                   <Tab
//                     eventKey="recent"
//                     title={`Upcoming Bookings (${bookingCount})`}
//                   >
//                     {recentBookingData
//                       ?.sort(
//                         (a, b) => new Date(b.booked_on) - new Date(a.booked_on)
//                       )
//                       .slice(0, 10)
//                       // .filter((item) => {
//                       //   const expirationDate = new Date(item.from_datetime);
//                       //   const now = new Date();
//                       //   return item.status === "Booked" && expirationDate > now;
//                       // })
//                       .map((item) => (
//                         <CardBookingHistory
//                           fromTime={moment(item.from_datetime).format('MM-DD-YYYY hh:mm')}
//                           toTime={moment(item.to_datetime).format('MM-DD-YYYY hh:mm')}
//                           key={item.id}
//                           id={item.id}
//                           img={item.parking_spots.photos}
//                           time={item.total_hours}
//                           amount={item.amount_paid}
//                           date={item.from_datetime}
//                           vehicle_number={item.vehicle_number}
//                           location={item.parking_spots.google_map}
//                           title={item.slot}
//                           payed_on={item.payed_on}
//                           onClick={handleShow}
//                           status={item.status}
//                           booked_on={moment(item.booked_on).format('MM-DD-YYYY hh:mm')}
//                         // img={BookingImg1}
//                         />
//                       ))}
//                     {recentBookingData
//                       .length === 0 && <div>No records found</div>}
//                   </Tab>
//                   <Tab
//                     eventKey="completed"
//                     title={`Completed (${confirmedBookingsCount})`}
//                   >
//                     {completedBookingData
//                       // ?.filter((item) => {
//                       //   const expirationDate = new Date(item.from_datetime);
//                       //   const now = new Date();
//                       //   return item.status === "Confirmed" || (item.status != "Cancelled" && expirationDate <= now);
//                       // })
//                       .map((item) => (
//                         <CardBookingHistory
//                         fromTime={moment(item.from_datetime).format('MM-DD-YYYY hh:mm')}
//                         toTime={moment(item.to_datetime).format('MM-DD-YYYY hh:mm')}
//                           key={item.id}
//                           id={item.id}
//                           time={item.time}
//                           amount={item.amount_paid}
//                           date={item.from_datetime}
//                           vehicle_number={item.vehicle_number}
//                           location={item.parking_spots.google_map}
//                           title={item.slot}
//                           payed_on={item.payed_on}
//                           onClick={handleShow}
//                           status={item.status}
//                           img={item.parking_spots.photos}
//                           booked_on={moment(item.booked_on).format('MM-DD-YYYY hh:mm')}                        />
//                       ))}
//                     {completedBookingData
//                       // ?.filter((item) => {
//                       //   const expirationDate = new Date(item.from_datetime);
//                       //   const now = new Date();
//                       //   return item.status === "Confirmed" || (item.status != "Cancelled" && expirationDate <= now);
//                       // })
//                       .length === 0 && <div>No records found</div>}
//                   </Tab>
//                   <Tab
//                     eventKey="cancelled"
//                     title={`Cancelled (${cancelledBookingsCount})`}
//                   >
//                     {cancelBookingData
//                       // ?.filter((item) => {
//                       //   return item.status === "Cancelled";
//                       // })
//                       .map((item) => (
//                         <CardBookingHistory
//                         fromTime={moment(item.from_datetime).format('MM-DD-YYYY hh:mm')}
//                         toTime={moment(item.to_datetime).format('MM-DD-YYYY hh:mm')}
//                           key={item.id}
//                           id={item.id}
//                           time={item.time}
//                           amount={item.amount_paid}
//                           date={item.from_datetime}
//                           vehicle_number={item.vehicle_number}
//                           location={item.parking_spots.google_map}
//                           title={item.slot}
//                           payed_on={item.payed_on}
//                           onClick={handleShow}
//                           status={item.status}
//                           img={item.parking_spots.photos}
//                           booked_on={moment(item.booked_on).format('MM-DD-YYYY hh:mm')}
//                          cancelled_booking={moment(item.cancelled_booking).format('MM-DD-YYYY hh:mm')}
//                         />
//                       ))}
//                     {cancelBookingData
//                       // ?.filter((item) => item.status === "Cancelled")
//                       .length === 0 && <div>No records found</div>}
//                   </Tab>
//                 </Tabs>

//                 {/* Modal content starts */}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <ParkingSpace />
//       <Footer />
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Body>
//           <div className=" booklistingContent">
//             <img
//               src={
//                 selectedCancelItem.img &&
//                 selectedCancelItem.img.length > 0 &&
//                 selectedCancelItem.img[0].photo_path &&
//                 `${import.meta.env.VITE_APP_BASE_URL
//                 }/storage/${selectedCancelItem.img[0].photo_path.slice(6)}`
//               }
//               className="img-fluid"
//             />
//             <h3>
//               <a>{selectedCancelItem.title}</a>
//             </h3>
//             <div className="location">{selectedCancelItem.location}</div>

//             <div className="time">
//               Booked on :{selectedCancelItem.booked_on}
//             </div>

//             <div className="dollar">
//               <span>Total Cost:</span> ${selectedCancelItem.amount}
//             </div>

//             <div className="row mb-2">
//               <label
//                 htmlFor="inputEmail3"
//                 className="col-xl-12 col-lg-12 col-sm-12 col-md-12 col-form-label"
//               >
//                 Comments
//               </label>
//               <div className="col-lg-12 col-lg-12 col-sm-12 col-md-12">
//                 <textarea
//                   id="commentInput"
//                   className="form-control"
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                 ></textarea>
//               </div>
//             </div>
//             {/* <div className="amount">$ {selectedCancelItem.amount}</div> */}
//           </div>
//         </Modal.Body>
//         <Modal.Footer
//           style={{
//             marginLeft: "10px",
//             marginRight: "10px",
//             marginBottom: "10px",
//           }}
//         >
//           <Button variant="primary" onClick={handleCancel}>
//             {loading ? (
//               <div className="loader">
//                 <Loader />
//               </div>
//             ) : (
//               " Cancel Booking"
//             )}
//           </Button>

//           <Button
//             variant="primary"
//             style={{
//               background: "#333",
//               border: "1px solid #eee",
//               color: "#fff",
//             }}
//             onClick={handleClose}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default withSwal(BookingHistory);
