import { useEffect, useState } from "react";
import BreadCrumbs from "../../components/BreadCrumbs";
import { NavLink, useNavigate } from "react-router-dom";
import AxiosClient from "../../axios/AxiosClient";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { confirmAlert } from "react-confirm-alert";
import Loader from "../../components/Loader";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

interface Photo {
  id: number;
  photo_path: string;
}

interface ParkingSpot {
  id: number;
  slot_name: string;
  available_time: string;
  google_map: string;
  isBooked: number;
  photos: Photo[];
}

const ParkingSpots = () => {
  const userRedux = useSelector((state: RootState) => state.user.value);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (parkingSpots.length === 0) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await OwnerAxiosClient.get(`/api/owner-parking-spots/${userRedux.auth_owner_id}`);
      if (response.data) {
        setParkingSpots(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (data: ParkingSpot) => {
    navigate("/view-parking-spot", { state: data });
  };

  const handleEdit = (data: ParkingSpot) => {
    navigate("/edit-parking-spot", { state: data });
  };

  const handleDelete = async (spot: ParkingSpot) => {
    if (spot.isBooked === 0) {
      confirmAlert({
        title: "Confirm Delete",
        message: "Are you sure you want to delete this parking spot?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              try {
                await AxiosClient.delete(`/api/parking-spots/${spot.id}`);
                setParkingSpots(parkingSpots.filter((parkingSpot) => parkingSpot.id !== spot.id));
                toast.success("Parking spot deleted successfully");
              } catch (error) {
                console.error("Error deleting parking spot:", error);
              }
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    } else {
      toast.error("Spot already booked. You can't delete it. Please contact us for more.");
    }
  };

  const handleView = async (id: number) => {
    navigate("/view-slot-bookings", { state: id });
  };

  return (
    <>
      <BreadCrumbs title="My Driveways" />
      <div className="loginOuter afterownerLogin">
        <div className="container">
          <div className="dashboardList">
            <div className="addslotBtn">
              <div className="float-end">
                <NavLink to="/rent-out-your-driveway" className="btn btn-primary">
                  Add Parking Slot
                </NavLink>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 mx-auto">
                {loading ? (
                  <div className="loader row">
                    <div
                      className="col-lg-12 col-xs-12 "
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "500px",
                      }}
                    >
                      <Loader />
                    </div>
                  </div>
                ) : (
                  <div className="tableListing table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Sl no</th>
                          <th>Slot Name</th>
                          <th>Available Time</th>
                          <th>Place</th>
                          <th>Photos</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parkingSpots.length ? (
                          parkingSpots.map((parkingSpot, index) => (
                            <tr key={parkingSpot.id}>
                              <td>{index + 1}</td>
                              <td>{parkingSpot.slot_name}</td>
                              <td>{parkingSpot.available_time}</td>
                              <td id="res-id" style={{ textWrap: "balance" }}>
                                {parkingSpot.google_map}
                              </td>
                              <td>
                                <div style={{ display: "flex" }}>
                                  {parkingSpot.photos.map((photo) => (
                                    <div className="img-alt" key={photo.id}>
                                      <img
                                        style={{ height: "20px", width: "25px" }}
                                        src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${photo.photo_path.slice(6)}`}
                                        alt="Parking Spot"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <i
                                  className="fa fa-eye"
                                  style={{ marginRight: "5px", cursor: "pointer" }}
                                  onClick={() => handleClick(parkingSpot)}
                                ></i>
                                <i
                                  style={{ marginRight: "5px", cursor: "pointer" }}
                                  className="fa fa-pencil text-success"
                                  onClick={() => handleEdit(parkingSpot)}
                                ></i>
                                <i
                                  className="fa fa-trash text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDelete(parkingSpot)}
                                ></i>
                                <span
                                  onClick={() => handleView(parkingSpot.id)}
                                  style={{
                                    marginLeft: "13px",
                                    color: "#ff7902",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                  }}
                                >
                                  View Booking
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                              Data not found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ParkingSpots;




// import { useEffect, useState } from "react";
// import BreadCrumbs from "../../components/BreadCrumbs";

// import { NavLink, useNavigate } from "react-router-dom";
// import AxiosClient from "../../axios/AxiosClient";
// import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// import { confirmAlert } from "react-confirm-alert";
// import Loader from "../../components/Loader";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";

// const ParkingSpots = () => {
//     const userRedux = useSelector((state) => {
//         return state.user.value;
//     });
//     const [parkingSpots, setParkingSpots] = useState([]);
//     const [trimmedText, setTrimmedText] = useState("");
//     const [loading, setLoading] = useState(false);

//     const navigate = useNavigate();

//     useEffect(() => {
//         if (parkingSpots.length == 0) {
//             fetchData();
//         }
//     }, []);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             // await OwnerAxiosClient.get("/sanctum/csrf-cookie");
//             const response = await OwnerAxiosClient.get(`/api/owner-parking-spots/${userRedux.auth_owner_id}`);
//             console.log("response owner data", response.data);
//             if (response.data) {
//                 setLoading(false);
//                 setParkingSpots(response.data);
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleClick = (data) => {
//         navigate("/view-parking-spot", { state: data });
//     };

//     const handleEdit = (data) => {
//         navigate("/edit-parking-spot", { state: data });
//     };

//     const handleDelete = async (spot) => {
//         if (spot.isBooked === 0) {
//             // Display confirmation dialog before deleting
//             confirmAlert({
//                 title: "Confirm Delete",
//                 message: "Are you sure you want to delete this parking spot?",
//                 buttons: [
//                     {
//                         label: "Yes",
//                         onClick: async () => {
//                             try {
//                                 // Send a DELETE request to the server to delete the parking spot with the given ID
//                                 await AxiosClient.delete(`/api/parking-spots/${spot.id}`);
//                                 // Remove the deleted parking spot from the local state
//                                 setParkingSpots(
//                                     parkingSpots.filter((parkingSpot) => parkingSpot.id !== spot.id)
//                                 );
//                                 toast.success("Parking spot deleted successfully");
//                                 console.log("Parking spot deleted successfully");
//                             } catch (error) {
//                                 console.error("Error deleting parking spot:", error);
//                             }
//                         },
//                     },
//                     {
//                         label: "No",
//                         onClick: () => { },
//                     },
//                 ],
//             });
//         } else {
//             toast.error("Spot already booked. You can't delete it. Please contact us for more.");
//         }
//     };

//     const handleView = async (data) => {
//         navigate("/view-slot-bookings", { state: data });
//     }

//     return (
//         <>
//             {/* <Header /> */}
//             {/* <div className="parking-slot-header">
//                 <NavLink className="parking-slots active" to="/my-parking-spot">
//                     My Driveways
//                     <div className="sub-head-arrow"><div className="sub-label-arrow"></div></div>
//                 </NavLink>
//                 <NavLink className="parking-slots non-active" to="/my-slot-bookings">
//                     Driveway Bookings
//                 </NavLink>
//                 <NavLink className="parking-slots non-active" to="/earnings">
//                     My Earnings
//                 </NavLink>
//             </div> */}
//             <BreadCrumbs title="My Driveways" />
//             <div className="loginOuter afterownerLogin">
//                 <div className="container">
//                     <div className="dashboardList">
//                         <div className="addslotBtn">
//                             <div className="float-end">
//                                 <NavLink to="/rent-out-your-driveway" className="btn btn-primary">
//                                     Add Parking Slot
//                                 </NavLink>
//                             </div>
//                         </div>
//                         <div className="row">
//                             <div className="col-lg-12 mx-auto">
//                                 {loading ? (
//                                     <div className="loader row">
//                                         <div
//                                             className="col-lg-12 col-xs-12 "
//                                             style={{
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 height: "500px",
//                                             }}
//                                         >
//                                             <Loader />
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <div className="tableListing table-responsive">
//                                         <table className="table table-hover">
//                                             <thead>
//                                             <tr>
//                                                 <th>Sl no</th>
//                                                 <th>Slot Name</th>
//                                                 <th>Available Time</th>
//                                                 <th>Place</th>
//                                                 {/* <th style={{ width: "10%" }}>Latitude</th>
//                           <th style={{ width: "10%" }}>Longitude</th> */}
//                                                 <th>Photos</th>
//                                                 {/* <th style={{ width: "20%" }}>Nearby Place</th> */}
//                                                 <th>Action</th>
//                                             </tr>
//                                             </thead>

//                                             <tbody>
//                                             {parkingSpots.length ? (
//                                                 parkingSpots.map((parkingSpot, index) => (
//                                                     <tr key={parkingSpot.id}>
//                                                         <td>{index + 1}</td>
//                                                         <td>{parkingSpot.slot_name}</td>
//                                                         <td>{parkingSpot.available_time}</td>
//                                                         <td id="res-id" style={{ textWrap: "balance" }}>
//                                                             {parkingSpot.google_map}
//                                                         </td>
//                                                         {/* <td>{parkingSpot.latitude}</td>
//                             <td>{parkingSpot.longitude}</td> */}

//                                                         <td>
//                                                             <div style={{ display: "flex" }}>
//                                                                 {parkingSpot.photos.map((photo) => (
//                                                                     <div className="img-alt" key={photo.id}>
//                                                                         <img
//                                                                             style={{
//                                                                                 height: "20px",
//                                                                                 width: "25px",
//                                                                             }}
//                                                                             src={`${import.meta.env.VITE_APP_BASE_URL
//                                                                             }/storage/${photo.photo_path.slice(6)}`}
//                                                                             alt="Parking Spot"
//                                                                         />
//                                                                     </div>
//                                                                 ))}
//                                                             </div>
//                                                         </td>
//                                                         {/* <td>{parkingSpot.nearby_places}</td> */}

//                                                         <td>
//                                                             <i
//                                                                 className="fa fa-eye"
//                                                                 style={{
//                                                                     marginRight: "5px",
//                                                                     cursor: "pointer",
//                                                                 }}
//                                                                 onClick={() => handleClick(parkingSpot)}
//                                                             ></i>
//                                                             {/*
//                               <NavLink
//                                 to="/edit-parking-spot"
//                                 className="viewLink"
//                               >
//                                 <i className="fa fa-pencil"></i>
//                               </NavLink> */}
//                                                             <i
//                                                                 style={{
//                                                                     marginRight: "5px",
//                                                                     cursor: "pointer",
//                                                                 }}
//                                                                 className="fa fa-pencil text-success "
//                                                                 onClick={() => handleEdit(parkingSpot)}
//                                                             ></i>
//                                                             <i
//                                                                 className="fa fa-trash text-danger"
//                                                                 style={{ cursor: "pointer" }}
//                                                                 onClick={() => handleDelete(parkingSpot)}
//                                                             ></i>
//                                                             <span onClick={() => handleView(parkingSpot.id)}
//                                                                 // to=`/view-slot-bookings/${id}`
//                                                                   style={{
//                                                                       marginLeft: "13px",
//                                                                       color: "#ff7902",
//                                                                       fontSize: "14px",
//                                                                       cursor: "pointer"
//                                                                   }}
//                                                             >
//                                                                     View Booking
//                                                                 </span>
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             ) : (
//                                                 <tr>
//                                                     <td colSpan={5} style={{ textAlign: "center" }}>
//                                                         {" "}
//                                                         Data not found
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default ParkingSpots;
