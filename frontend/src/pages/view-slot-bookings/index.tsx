
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BreadCrumbs from "../../components/BreadCrumbs";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ViewlotBookings = () => {
  const { state } = useLocation();
  const [data, setData] = useState<any>(null);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [cancelledBookingsCount, setCancelledBookingsCount] = useState<number>(0);
  const [confirmedBookingsCount, setConfirmedBookingsCount] = useState<number>(0);
  const [bookingLists, setBookingLists] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedToDate, setSelectedToDate] = useState<string>("");

  const userRedux = useSelector((state: any) => state.user.value);

  useEffect(() => {
    setData(state);
  }, [state]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setBookingCount(
      bookingLists.filter((item) => {
        const expirationDate = new Date(item.from_datetime);
        const now = new Date();
        return (item.status === "Booked" || item.status === "Pending") && expirationDate >= now;
      }).length
    );

    setCancelledBookingsCount(
      bookingLists.filter((item) => item.status === "Cancelled" && data == item.parking_spot_id).length
    );

    setConfirmedBookingsCount(
      bookingLists.filter((item) => {
        const expirationDate = new Date(item.from_datetime);
        const now = new Date();
        return item.status !== "Cancelled" && expirationDate < now && data == item.parking_spot_id;
      }).length
    );
  }, [bookingLists]);

  const handleDateChange = (date: string) => {
    setSelectedFromDate(date);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await OwnerAxiosClient.get(`/api/owner-bookings/${userRedux.auth_owner_id}`);
      if (response.data) {
        setLoading(false);
        setBookingLists(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (data: any) => {
    navigate("/view-booking-slot", { state: data });
  };

  const handleEdit = (data: any) => {
    navigate("/edit-booking-slot", { state: data });
  };

  const handleCancelClick = (data: any) => {
    navigate("/view-cancelled-booking", { state: data });
  };

  return (
    <div>
      <BreadCrumbs title="View Bookings" />
      <div className="loginOuter afterownerLogin">
        <div className="container">
          <div className="dashboardList">
            <Tabs defaultActiveKey="recent" id="fill-tab-example" className="mb-3">
              <Tab eventKey="recent" title={`Recent Bookings (${bookingCount})`}>
                <div className="row">
                  <div className="col-lg-12 col-xs-12">
                    {loading ? (
                      <LoaderWrapper />
                    ) : (
                      <BookingTable
                        bookings={bookingLists.filter((item) => {
                          const expirationDate = new Date(item.from_datetime);
                          const now = new Date();
                          return (item.status === "Booked" || item.status === "Pending") && expirationDate >= now;
                        })}
                        type="recent"
                        onClick={handleClick}
                        onEdit={handleEdit}
                        empty={bookingCount === 0}
                      />
                    )}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="completed" title={`Completed (${confirmedBookingsCount})`}>
                <div className="row">
                  <div className="col-lg-12 col-xs-12">
                    {loading ? (
                      <LoaderWrapper />
                    ) : (
                      <BookingTable
                        bookings={bookingLists.filter((item) => {
                          const expirationDate = new Date(item.from_datetime);
                          const now = new Date();
                          return item.status !== "Cancelled" && expirationDate < now && data == item.parking_spot_id;
                        })}
                        type="completed"
                        empty={confirmedBookingsCount === 0}
                      />
                    )}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="cancelled" title={`Cancelled (${cancelledBookingsCount})`}>
                <div className="row">
                  <div className="col-lg-12 col-xs-12">
                    {loading ? (
                      <LoaderWrapper />
                    ) : (
                      <BookingTable
                        bookings={bookingLists.filter((item) => item.status === "Cancelled" && data == item.parking_spot_id)}
                        type="cancelled"
                        onCancelClick={handleCancelClick}
                        empty={cancelledBookingsCount === 0}
                      />
                    )}
                  </div>
                </div>
              </Tab>
            </Tabs>
            <NavLink to="/my-parking-spot" className="d-flex p-3 justify-content-center">
              Back
            </NavLink>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewlotBookings;

const LoaderWrapper = () => (
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
  bookings: any[];
  type: "recent" | "completed" | "cancelled";
  onClick?: (data: any) => void;
  onEdit?: (data: any) => void;
  onCancelClick?: (data: any) => void;
  empty: boolean;
}

const BookingTable = ({ bookings, type, onClick, onEdit, onCancelClick, empty }: BookingTableProps) => (
  <div className="tableListing table-responsive">
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Sl no</th>
          <th>Name</th>
          <th>From Date & Time</th>
          <th>To Date & Time</th>
          {type === "cancelled" && <th>Booked On</th>}
          <th>Vehicle Number</th>
          <th>Slot</th>
          {type === "cancelled" && <th>Cancelled Date</th>}
          <th>Amount</th>
          {type !== "completed" && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking, index) => (
          <tr key={booking.id}>
            <td>{index + 1}</td>
            <td>{booking.user.name}</td>
            <td>{booking.from_datetime}</td>
            <td>{booking.to_datetime}</td>
            {type === "cancelled" && <td>{booking.booked_on}</td>}
            <td>{booking.vehicle_number}</td>
            <td>{booking.slot}</td>
            {type === "cancelled" && (
              <td>{booking.cancelled_booking ? booking.cancelled_booking.cancelled_date : ""}</td>
            )}
            <td>{booking.amount_paid}</td>
            {type !== "completed" && (
              <td>
                {type === "recent" && (
                  <>
                    <i className="fa fa-eye" style={{ marginRight: "5px", cursor: "pointer" }} onClick={() => onClick?.(booking)}></i>
                    <i className="fa fa-pencil text-success" style={{ marginRight: "5px", cursor: "pointer" }} onClick={() => onEdit?.(booking)}></i>
                  </>
                )}
                {type === "cancelled" && (
                  <i className="fa fa-eye" style={{ marginRight: "5px", cursor: "pointer" }} onClick={() => onCancelClick?.(booking)}></i>
                )}
              </td>
            )}
          </tr>
        ))}
        {empty && (
          <tr>
            <td colSpan={10} style={{ textAlign: "center" }}>
              No Record found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);











// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import { useEffect, useState } from "react";
// import Loader from "../../components/Loader";
// import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ViewlotBookings = () => {
//     const { state } = useLocation();
//     const [data, setData] = useState(null);
//     useEffect(() => {
//       setData(state);
//     }, [state]);
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
//         return item.status === "Cancelled" && data == item.parking_spot_id;
//       }).length
//     );

//     // Completed
//     setConfirmedBookingsCount(
//       bookingLists.filter((item) => {
//         const expirationDate = new Date(item.from_datetime);
//         const now = new Date();
//         return item.status != "Cancelled" && expirationDate < now && data == item.parking_spot_id;
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
//       console.log("Bookingresponse data", response.data);
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
//       <BreadCrumbs title="View Bookings"/>
//       <div>
//       {/* <NavLink onClick={(e) => {
//             e.preventDefault();
//             navigate(-1);
//           }}
//             style={{ display: 'flex', float: 'right', padding: '20px' }}
//           >Back</NavLink> */}
//       </div>
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
//                                   <td>{booking.from_datetime}</td>
//                                   <td>{booking.to_datetime}</td>
//                                   <td>{booking.booked_on}</td>
//                                   <td>{booking.vehicle_number}</td>
//                                   <td>{booking.slot}</td>
//                                   <td>{booking.amount_paid}</td>
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
//                                 console.log("item", item);
//                                 const expirationDate = new Date(item.from_datetime);
//                                 const now = new Date();
//                                 return item.status != "Cancelled" && expirationDate < now && data == item.parking_spot_id;
//                               })
//                               .map((booking, index) => (
//                                 <tr key={booking.id}>
//                                   <td>{index + 1}</td>

//                                   <td>{booking.user.name}</td>

//                                   <td>{booking.from_datetime}</td>

//                                   <td> {booking.to_datetime}</td>
//                                   {/* <td>{booking.vehicle_name}</td> */}
//                                   <td>{booking.vehicle_number}</td>
//                                   <td>{booking.slot}</td>
//                                   <td>{booking.amount_paid}</td>
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
//                                 return item.status === "Cancelled" && data == item.parking_spot_id;
//                               })
//                               .map((booking, index) => (
//                                 <tr key={booking.id}>
//                                   <td>{index + 1}</td>

//                                   <td>{booking.user.name}</td>

//                                   <td>{booking.from_datetime}</td>

//                                   <td> {booking.to_datetime}</td>

//                                   <td>{booking.booked_on}</td>
//                                   <td>{booking.vehicle_number}</td>

//                                   <td>{booking.slot}</td>
//                                   <td>
//                                     {booking.cancelled_booking
//                                       ? booking.cancelled_booking.cancelled_date
//                                       : ""}
//                                   </td>
//                                   <td>{booking.amount_paid}</td>
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
//             </Tabs>
//             <NavLink to="/my-parking-spot"
//                     className='d-flex p-3 justify-content-center'>Back</NavLink>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ViewlotBookings;
