import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BreadCrumbs from "../../components/BreadCrumbs";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from 'moment';
import type { RootState } from "../../redux/store";

interface Booking {
  id: number;
  user: {
    name: string;
  };
  from_datetime: string;
  to_datetime: string;
  booked_on: string;
  vehicle_number: string;
  slot: string;
  amount_paid: number;
  status: string;
  cancelled_booking?: {
    cancelled_date: string;
  };
}

const MyBookingSlots: React.FC = () => {
  const userRedux = useSelector((state: RootState) => state.user.value);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [cancelledBookingsCount, setCancelledBookingsCount] = useState<number>(0);
  const [confirmedBookingsCount, setConfirmedBookingsCount] = useState<number>(0);
  const [bookingLists, setBookingLists] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const now = new Date();

    setBookingCount(
      bookingLists.filter(item => {
        const expirationDate = new Date(item.from_datetime);
        return (item.status === "Booked" || item.status === "Pending") && expirationDate >= now;
      }).length
    );

    setCancelledBookingsCount(
      bookingLists.filter(item => item.status === "Cancelled").length
    );

    setConfirmedBookingsCount(
      bookingLists.filter(item => {
        const expirationDate = new Date(item.from_datetime.replace(" ", "T"));
        return item.status !== "Cancelled" && expirationDate < now;
      }).length
    );
  }, [bookingLists]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await OwnerAxiosClient.get(`/api/owner-bookings/${userRedux.auth_owner_id}`);
      if (response.data) {
        setBookingLists(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (data: Booking) => {
    navigate("/view-booking-slot", { state: data });
  };

  const handleEdit = (data: Booking) => {
    navigate("/edit-booking-slot", { state: data });
  };

  const handleCancelClick = (data: Booking) => {
    navigate("/view-cancelled-booking", { state: data });
  };

  return (
    <div>
      <BreadCrumbs title="Driveway Bookings" />
      <div className="loginOuter afterownerLogin">
        <div className="container">
          <div className="dashboardList">
            <Tabs defaultActiveKey="recent" id="fill-tab-example" className="mb-3">
              <Tab eventKey="recent" title={`Recent Bookings (${bookingCount})`}>
                <div className="row">
                  <div className="col-lg-12 col-xs-12">
                    {loading ? (
                      <LoaderContainer />
                    ) : (
                      <BookingTable
                        bookings={bookingLists.filter(item => (item.status === "Booked" || item.status === "Pending") && new Date(item.from_datetime) >= new Date())}
                        bookingType="recent"
                        handleClick={handleClick}
                        handleEdit={handleEdit}
                      />
                    )}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="completed" title={`Completed (${confirmedBookingsCount})`}>
                <div className="row">
                  <div className="col-lg-12 col-xs-12">
                    {loading ? (
                      <LoaderContainer />
                    ) : (
                      <BookingTable
                        bookings={bookingLists.filter(item => item.status !== "Cancelled" && new Date(item.from_datetime.replace(" ", "T")) < new Date())}
                        bookingType="completed"
                      />
                    )}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="cancelled" title={`Cancelled (${cancelledBookingsCount})`}>
                <div className="row">
                  <div className="col-lg-12 col-xs-12">
                    {loading ? (
                      <LoaderContainer />
                    ) : (
                      <BookingTable
                        bookings={bookingLists.filter(item => item.status === "Cancelled")}
                        bookingType="cancelled"
                        handleClick={handleCancelClick}
                      />
                    )}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const LoaderContainer: React.FC = () => (
  <div className="loader row">
    <div
      className="col-lg-12 col-xs-12 "
      style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "500px" }}
    >
      <Loader />
    </div>
  </div>
);

interface BookingTableProps {
  bookings: Booking[];
  bookingType: "recent" | "completed" | "cancelled";
  handleClick?: (data: Booking) => void;
  handleEdit?: (data: Booking) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings, bookingType, handleClick, handleEdit }) => (
  <div className="tableListing table-responsive">
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Sl no</th>
          <th>Name</th>
          <th>From Date & Time</th>
          <th>To Date & Time</th>
          {bookingType !== "completed" && <th>Booked on</th>}
          <th>Vehicle Number</th>
          <th>Slot</th>
          {bookingType === "cancelled" && <th>Cancelled Date</th>}
          <th>Amount</th>
          {bookingType !== "completed" && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <tr key={booking.id}>
              <td>{index + 1}</td>
              <td>{booking.user.name}</td>
              <td>{moment(booking.from_datetime).format('MM-DD-YYYY hh:mm')}</td>
              <td>{moment(booking.to_datetime).format('MM-DD-YYYY hh:mm')}</td>
              {bookingType !== "completed" && <td>{moment(booking.booked_on).format('MM-DD-YYYY hh:mm')}</td>}
              <td>{booking.vehicle_number}</td>
              <td>{booking.slot}</td>
              {bookingType === "cancelled" && <td>{booking.cancelled_booking ? moment(booking.cancelled_booking.cancelled_date).format('MM-DD-YYYY hh:mm') : ''}</td>}
              <td>${booking.amount_paid}</td>
              {bookingType !== "completed" && handleClick && (
                <td>
                  <i className="fa fa-eye" style={{ marginRight: "5px", cursor: "pointer" }} onClick={() => handleClick(booking)}></i>
                  {bookingType === "recent" && handleEdit && (
                    <i className="fa fa-pencil text-success" style={{ marginRight: "5px", cursor: "pointer" }} onClick={() => handleEdit(booking)}></i>
                  )}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={bookingType === "cancelled" ? 10 : 9} style={{ textAlign: "center" }}>No Record found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default MyBookingSlots;






// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import { useEffect, useState } from "react";
// import Loader from "../../components/Loader";
// import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import moment from 'moment';

// const MyBookingSlots = () => {
//   const userRedux = useSelector((state) => {
//     return state.user.value;
//   });
//   const [bookingCount, setBookingCount] = useState(0);
//   const [cancelledBookingsCount, setCancelledBookingsCount] = useState(0);
//   const [confirmedBookingsCount, setConfirmedBookingsCount] = useState(0);
//   const [bookingLists, setBookingLists] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const [selectedFromDate, setSelectedFromDate] = useState("");
//   const [selectedToDate, setSelectedToDate] = useState("");

//   useEffect(() => {
//     fetchData();

//     // setBookingCount(
//     //   data.filter((item) => {
//     //     return item;
//     //   }).length
//     // );
//     // setCancelledBookingsCount(
//     //   data.filter((item) => {
//     //     return item.status === "cancelled";
//     //   }).length
//     // );
//     // setConfirmedBookingsCount(
//     //   data.filter((item) => {
//     //     return item.status === "confirmed";
//     //   }).length
//     // );
//   }, []);

//   useEffect(() => {

//     // Recent
//     setBookingCount(
//       bookingLists.filter((item) => {
//         const expirationDate = new Date(item.from_datetime);
//         const now = new Date();
//         return (item.status === "Booked" || item.status === "Pending") && expirationDate >= now;
//       }).length
//     );

//     // Cancelled
//     setCancelledBookingsCount(
//       bookingLists.filter((item) => {
//         return item.status === "Cancelled";
//       }).length
//     );

//     // Completed
//     setConfirmedBookingsCount(
//       bookingLists.filter((item) => {
//         // Parse the date in a way Safari understands
//         const expirationDate = new Date(item.from_datetime.replace(" ", "T"));
//         const now = new Date();

//         return item.status !== "Cancelled" && expirationDate < now;
//       }).length
//     );
//   }, [bookingLists]);

//   const handleDateChange = (date) => {
//     setSelectedFromDate(date);
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await OwnerAxiosClient.get(`/api/owner-bookings/${userRedux.auth_owner_id}`);
//       if (response.data) {
//         setLoading(false);
//         setBookingLists(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClick = (data) => {
//     navigate("/view-booking-slot", { state: data });
//   };

//   const handleEdit = (data) => {
//     navigate("/edit-booking-slot", { state: data });
//   };

//   const handleCancelClick = (data) => {
//     navigate("/view-cancelled-booking", { state: data });
//   };

//   return (
//     <div>
//       {/* <Header /> */}
//       {/* <div className="parking-slot-header">
//         <NavLink className="parking-slots non-active" to="/my-parking-spot">
//           My Driveways
//         </NavLink>
//         <NavLink className="parking-slots  active" to="/my-slot-bookings">
//           Driveway Bookings
//           <div className="sub-head-arrow"><div className="sub-label-arrow"></div></div>
//         </NavLink>

//         <NavLink className="parking-slots non-active" to="/earnings">
//           My Earnings
//         </NavLink>
//       </div> */}
//       <BreadCrumbs title="Driveway Bookings" />
//       <div className="loginOuter afterownerLogin">
//         <div className="container">
//           <div className="dashboardList">
//             <Tabs
//               defaultActiveKey="recent"
//               id="fill-tab-example"
//               className="mb-3"
//             >
//               <Tab eventKey="recent" title={`Recent Bookings (${bookingCount})`}>
//                 <div className="row">
//                   <div className="col-lg-12 col-xs-12">
//                     {loading ? (
//                       <div className="loader row">
//                         <div
//                           className="col-lg-12 col-xs-12 "
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             height: "500px",
//                           }}
//                         >
//                           <Loader />
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="tableListing table-responsive">
//                         <table className="table table-hover">
//                           <thead>
//                             <tr>
//                               <th>Sl no</th>
//                               <th> Name</th>
//                               <th>From Date & Time </th>
//                               <th>To Date & Time </th>
//                               <th>Booked on</th>
//                               <th>Vehicle Number</th>
//                               <th>Slot</th>
//                               <th>Amount</th>
//                               <th>Action</th>
//                             </tr>
//                           </thead>

//                           <tbody>
//                             {bookingLists
//                               ?.filter((item) => {
//                                 const expirationDate = new Date(item.from_datetime);
//                                 const now = new Date();
//                                 // Check for both "Booked" and "Pending" statuses and future bookings
//                                 return (item.status === "Booked" || item.status === "Pending") && expirationDate >= now;
//                               })
//                               .map((booking, index) => (
//                                 <tr key={booking.id}>
//                                   <td>{index + 1}</td>
//                                   <td>{booking.user.name}</td>
//                                   <td>{moment(booking.from_datetime).format('MM-DD-YYYY hh:mm')}</td>
//                                   <td>{moment(booking.to_datetime).format('MM-DD-YYYY hh:mm')}</td>
//                                   <td>{moment(booking.booked_on).format('MM-DD-YYYY hh:mm')}</td>
//                                   {/* <td>{booking.to_datetime}</td>
//                                   <td>{booking.booked_on}</td> */}
//                                   <td>{booking.vehicle_number}</td>
//                                   <td>{booking.slot}</td>
//                                   <td>${booking.amount_paid}</td>
//                                   <td>
//                                     <i
//                                       className="fa fa-eye"
//                                       style={{
//                                         marginRight: "5px",
//                                         cursor: "pointer",
//                                       }}
//                                       onClick={() => handleClick(booking)}
//                                     ></i>
//                                     <i
//                                       style={{
//                                         marginRight: "5px",
//                                         cursor: "pointer",
//                                       }}
//                                       className="fa fa-pencil text-success"
//                                       onClick={() => handleEdit(booking)}
//                                     ></i>
//                                   </td>
//                                 </tr>
//                               ))}
//                             {bookingCount === 0 && (
//                               <tr>
//                                 <td colSpan={8} style={{ textAlign: "center" }}>
//                                   No Record found
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>

//                         </table>
//                       </div>
//                     )}

//                     <div> </div>
//                   </div>
//                 </div>
//               </Tab>
//               <Tab
//                 eventKey="completed"
//                 title={`Completed (${confirmedBookingsCount})`}
//               >
//                 <div className="row">
//                   <div className="col-lg-12 col-xs-12">
//                     {loading ? (
//                       <div className="loader row">
//                         <div
//                           className="col-lg-12 col-xs-12 "
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             height: "500px",
//                           }}
//                         >
//                           <Loader />
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="tableListing table-responsive">
//                         <table className="table table-hover">
//                           <thead>
//                             <tr>
//                               <th>Sl no</th>
//                               <th> Name</th>
//                               <th>From Date & Time</th>
//                               <th>To Date & Time</th>
//                               {/* <th>Vehicle Name</th> */}
//                               <th>Vehicle Number</th>
//                               <th>Slot</th>
//                               <th>Amount</th>
//                             </tr>
//                           </thead>

//                           <tbody>
//                             {bookingLists
//                               ?.filter((item) => {
//                                 // Replace space with "T" to ensure ISO format for date parsing
//                                 const expirationDate = new Date(item.from_datetime.replace(" ", "T"));
//                                 const now = new Date();
//                                 return item.status !== "Cancelled" && expirationDate < now;
//                               })
//                               .map((booking, index) => (
//                                 <tr key={booking.id}>
//                                   <td>{index + 1}</td>
//                                   <td>{booking.user.name}</td>
//                                   {/* <td>{new Date(booking.from_datetime.replace(" ", "T")).toLocaleString()}</td>
//                                   <td>{new Date(booking.to_datetime.replace(" ", "T")).toLocaleString()}</td> */}
//                                     <td>{moment(booking.from_datetime).format('MM-DD-YYYY hh:mm')}</td>
//                                   <td>{moment(booking.to_datetime).format('MM-DD-YYYY hh:mm')}</td>
                                  
//                                   <td>{booking.vehicle_number}</td>
//                                   <td>{booking.slot}</td>
//                                   <td>${booking.amount_paid}</td>
//                                 </tr>
//                               ))}
//                             {confirmedBookingsCount === 0 && (
//                               <tr>
//                                 <td colSpan={8} style={{ textAlign: "center" }}>
//                                   No Record found
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>

//                         </table>
//                       </div>
//                     )}

//                     <div> </div>
//                   </div>
//                 </div>
//               </Tab>
//               <Tab
//                 eventKey="cancelled"
//                 title={`Cancelled (${cancelledBookingsCount})`}
//               >
//                 <div className="row">
//                   <div className="col-lg-12 col-xs-12">
//                     {loading ? (
//                       <div className="loader row">
//                         <div
//                           className="col-lg-12 col-xs-12 "
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             height: "500px",
//                           }}
//                         >
//                           <Loader />
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="tableListing table-responsive">
//                         <table className="table table-hover">
//                           <thead>
//                             <tr>
//                               <th>Sl no</th>
//                               <th> Name</th>
//                               <th>From Date & Time </th>
//                               <th>To Date & Time</th>
//                               <th>Booked On</th>
//                               <th>Vehicle Number</th>
//                               <th>Slot</th>
//                               <th>Cancelled Date</th>
//                               <th>Amount</th>
//                               <th>Action</th>
//                             </tr>
//                           </thead>

//                           <tbody>
//                             {bookingLists
//                               ?.filter((item) => {
//                                 return item.status === "Cancelled";
//                               })
//                               .map((booking, index) => (
//                                 <tr key={booking.id}>
//                                   <td>{index + 1}</td>
//                                   <td>{booking.user.name}</td>
//                                   {/* <td>{new Date(booking.from_datetime.replace(" ", "T")).toLocaleString()}</td>
//                                   <td>{new Date(booking.to_datetime.replace(" ", "T")).toLocaleString()}</td>
//                                   <td>{new Date(booking.booked_on.replace(" ", "T")).toLocaleString()}</td> */}
//                                    <td>{moment(booking.from_datetime).format('MM-DD-YYYY hh:mm')}</td>
//                                   <td>{moment(booking.to_datetime).format('MM-DD-YYYY hh:mm')}</td>
//                                   <td>{moment(booking.booked_on).format('MM-DD-YYYY hh:mm')}</td>
//                                   <td>{booking.vehicle_number}</td>
//                                   <td>{booking.slot}</td>
//                                   {/* <td>
//                                     {booking.cancelled_booking
//                                       ? new Date(booking.cancelled_booking.cancelled_date.replace(" ", "T")).toLocaleString()
//                                       : ""}
//                                   </td> */}
//                                   <td>{booking.cancelled_booking ? moment(booking.from_datetime).format('MM-DD-YYYY hh:mm'):''}</td>
                               
//                                   <td>${booking.amount_paid}</td>
//                                   <td>
//                                     <i
//                                       className="fa fa-eye"
//                                       style={{
//                                         marginRight: "5px",
//                                         cursor: "pointer",
//                                       }}
//                                       onClick={() => handleCancelClick(booking)}
//                                     ></i>
//                                   </td>
//                                 </tr>
//                               ))}
//                             {cancelledBookingsCount === 0 && (
//                               <tr>
//                                 <td colSpan={10} style={{ textAlign: "center" }}>
//                                   No Record found
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}

//                     <div> </div>
//                   </div>
//                 </div>
//               </Tab>
//             </Tabs>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default MyBookingSlots;
