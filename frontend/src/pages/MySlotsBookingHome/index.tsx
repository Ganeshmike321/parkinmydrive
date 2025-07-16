import { useEffect, useState } from "react";
import BreadCrumbs from "../../components/BreadCrumbs";
import { NavLink, useNavigate } from "react-router-dom";
import AxiosClient from "../../axios/AxiosClient";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { confirmAlert } from "react-confirm-alert";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MyBookingSlots from "../MyBookingSlots";

interface Photo {
  id: number;
  photo_path: string;
}

interface ParkingSpot {
  id: number;
  slot_name: string;
  available_time: string;
  google_map: string;
  photos: Photo[];
  isBooked?: number;
}

const MySlotBookingsHome: React.FC = () => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [trimmedText, setTrimmedText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await OwnerAxiosClient.get("/api/owner-parking-spots");
      console.log("response owner data", response.data);
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

  const handleDelete = async (id: number) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this parking spot?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await AxiosClient.delete(`/api/parking-spots/${id}`);
              setParkingSpots(parkingSpots.filter((spot) => spot.id !== id));
              console.log("Parking spot deleted successfully");
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
  };

  return (
    <>
      {/* <Header /> */}
      <div className="parking-slot-header">
        <NavLink to="/rent-out-your-driveway">My Driveways</NavLink>
        <NavLink to="/rent-out-your-driveway">Driveway Bookings</NavLink>
        <NavLink to="/rent-out-your-driveway">My Earnings</NavLink>
      </div>
      <MyBookingSlots />
      <Footer />
    </>
  );
};

export default MySlotBookingsHome;
















// import { useEffect, useState } from "react";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import { NavLink, useNavigate } from "react-router-dom";
// import AxiosClient from "../../axios/AxiosClient";
// import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// import { confirmAlert } from "react-confirm-alert";
// import Loader from "../../components/Loader";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import MyBookingSlots from "../MyBookingSlots";
// const MySlotBookingsHome = () => {
//     const [parkingSpots, setParkingSpots] = useState([]);
//     const [trimmedText, setTrimmedText] = useState("");
//     const [loading, setLoading] = useState(false);

//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const response = await OwnerAxiosClient.get("/api/owner-parking-spots");
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

//     const handleDelete = async (id) => {
//         // Display confirmation dialog before deleting
//         confirmAlert({
//             title: "Confirm Delete",
//             message: "Are you sure you want to delete this parking spot?",
//             buttons: [
//                 {
//                     label: "Yes",
//                     onClick: async () => {
//                         try {
//                             // Send a DELETE request to the server to delete the parking spot with the given ID
//                             await AxiosClient.delete(`/api/parking-spots/${id}`);
//                             // Remove the deleted parking spot from the local state
//                             setParkingSpots(
//                                 parkingSpots.filter((parkingSpot) => parkingSpot.id !== id)
//                             );
//                             console.log("Parking spot deleted successfully");
//                         } catch (error) {
//                             console.error("Error deleting parking spot:", error);
//                         }
//                     },
//                 },
//                 {
//                     label: "No",
//                     onClick: () => { },
//                 },
//             ],
//         });
//     };

//     return (
//         <>
//             {/* <Header /> */}
//             <div className="parking-slot-header">
//                 <NavLink to="/rent-out-your-driveway">
//                     My Driveways
//                 </NavLink>
//                 <NavLink to="/rent-out-your-driveway">
//                     Driveway Bookings
//                 </NavLink>
//                 <NavLink to="/rent-out-your-driveway">
//                     My Earnings
//                 </NavLink>
//             </div>
//             <MyBookingSlots />
//             <Footer />
//         </>
//     );
// };

// export default MySlotBookingsHome;
