import { useState, useEffect } from "react";
import BreadCrumbs from "../../components/BreadCrumbs";
import Footer from "../../components/Footer";
import ParkingSpace from "../../components/ParkingSpace";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  convertToMySQLDate,
  convertToMySQLDatetime,
  formatDate,
} from "../../utils/DateTime";
import AxiosClient from "../../axios/AxiosClient";

interface FormData {
  from: string | null;
  to: string | null;
  from_time: string;
  to_time: string;
  no_of_vehicle: string;
  hours: string;
  vehicle_type: string;
  vehicle_fees?: string;
  vehicle_number: string;
  destination?: string;
  parking_spot_id?: string | null;
}

const ReviewBookingOld = (): React.ReactElement => {
  const searchState = useSelector((state: any) => state.search.value);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    from: null,
    to: null,
    from_time: "",
    to_time: "",
    no_of_vehicle: "",
    hours: "",
    vehicle_type: "SUV",
    vehicle_fees: "",
    vehicle_number: "",
    destination: "",
    parking_spot_id: null,
  });

  useEffect(() => {
    const from = localStorage.getItem("from") ?? "";
    const storedFromDateTime = formatDate(from);
    const to = localStorage.getItem("to") ?? "";
    const storedToDateTime = formatDate(to);

    setFormData({
      from: storedFromDateTime,
      to: storedToDateTime,
      from_time: localStorage.getItem("from_time") || "",
      to_time: localStorage.getItem("to_time") || "",
      no_of_vehicle: localStorage.getItem("no_of_vehicle") || "",
      hours: localStorage.getItem("hours") || "",
      vehicle_type: "SUV",
      destination: searchState.destination?.label || "",
      vehicle_fees: localStorage.getItem("vehicle_fees") || "",
      vehicle_number: localStorage.getItem("vehicle_numbers") || "",
      parking_spot_id: localStorage.getItem("parking_id"),
    });
  }, []);

  const handleSubmit = async () => {
    const totalAmount = Number(formData.no_of_vehicle) * Number(formData.hours) * 10;

    const bookingData = {
      parking_spot_id: formData.parking_spot_id,
      from_datetime: convertToMySQLDatetime(formData.from ?? "", formData.from_time ?? ""),
      to_datetime: convertToMySQLDatetime(formData.to ?? "", formData.to_time ?? ""),
      vehicle_name: formData.vehicle_type,
      vehicle_number: formData.vehicle_number,
      slot: "slot A",
      amount_paid: totalAmount,
      booked_on: convertToMySQLDate(new Date()),
      total_hours: formData.hours,
      location: "Location Name",
      status: "Confirmed",
    };

    try {
      const { data, status } = await AxiosClient.post("/api/add-booking", bookingData);
      if (status === 201) {
        navigate("/login");
      } else {
        console.error("Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <>
      <BreadCrumbs title={"Review Booking"} />
      <div className="loginOuter">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mx-auto">
              <div className="card">
                <div className="reviewDetails">
                  <div className="row">
                    <div className="col-lg-3 col-sm-12 col-md-6">
                      <p>
                        <strong>Destination</strong>
                        <span> {formData.destination}</span>
                        0.31 km away
                      </p>
                    </div>
                    <div className="col-lg-3 col-sm-12 col-md-6">
                      <p>
                        <strong>Date & Time</strong>
                        <span>
                          From :{formData.from}&nbsp;
                          {formData.from_time}
                        </span>
                        <span>
                          To :{formData.to}&nbsp;
                          {formData.to_time}
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-12 col-md-6">
                      <p>
                        <strong>Vehicle Details</strong>
                        <span>{formData.hours} hours</span>
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-12 col-md-6">
                      <p>
                        <strong>No. of Vehicles</strong>
                        {formData.no_of_vehicle}
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-12 col-md-6">
                      <p>
                        <strong>Amount</strong>
                        <span>
                          ${Number(formData.no_of_vehicle) * Number(formData.hours) * 10}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-sm-12 col-md-12 text-center">
                      <button onClick={handleSubmit} className="btn btn-primary" type="button">
                        Confirm
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ParkingSpace />
      <Footer />
    </>
  );
};

export default ReviewBookingOld;














// import { useState, useEffect } from "react";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
// import ParkingSpace from "../../components/ParkingSpace";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import {
//   convertToMySQLDate,
//   convertToMySQLDatetime,
//   formatDate,
// } from "../../utils/DateTime";
// import AxiosClient from "../../axios/AxiosClient";

// const ReviewBookingOld = () => {
//   const searchState = useSelector((state) => {
//     return state.search.value;
//   });
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     from: null,
//     to: null,
//     from_time: "",
//     to_time: "",
//     no_of_vehicle: "",
//     hours: "",
//     vehicle_type: "",
//     vehicle_fees: "",
//     vehicle_number: "",
//   });

//   useEffect(() => {
//     const from = localStorage.getItem("from") ?? "";
//     const storedFromDateTime = formatDate(from);

//     const to = localStorage.getItem("to") ?? "";
//     const storedToDateTime = formatDate(to);
//     const storedFromTime = localStorage.getItem("from_time");
//     const storedToTime = localStorage.getItem("to_time");
//     const storedNoOfVehicle = localStorage.getItem("no_of_vehicle");
//     const storedHours = localStorage.getItem("hours");
//     const storedVehicleFees = localStorage.getItem("vehicle_fees");
//     const storedVehicleNumbers = localStorage.getItem("vehicle_numbers");
//     const storedParkingId = localStorage.getItem("parking_id");

//     setFormData({
//       from: storedFromDateTime,
//       to: storedToDateTime,
//       from_time: storedFromTime,
//       to_time: storedToTime,
//       no_of_vehicle: storedNoOfVehicle,
//       hours: storedHours,
//       vehicle_type: "SUV", // You can set the default value here
//       destination: searchState.destination.label
//         ? searchState.destination.label
//         : "",
//       vehicle_fees: storedVehicleFees,
//       vehicle_number: storedVehicleNumbers,
//       parking_spot_id: storedParkingId,
//     });
//   }, []);

//   const handleSubmit = async () => {
//     const bookingData = {
//       parking_spot_id: formData.parking_spot_id,
//       from_datetime: convertToMySQLDatetime(formData.from, formData.from_time),

//       to_datetime: convertToMySQLDatetime(formData.to, formData.to_time),
//       vehicle_name: formData.vehicle_type,
//       vehicle_number: formData.vehicle_number,
//       slot: "slot A",
//       amount_paid: formData.no_of_vehicle * formData.hours * 10,
//       booked_on: convertToMySQLDate(new Date()),
//       total_hours: formData.hours,
//       location: "Location Name",
//       status: "Confirmed",
//     };
//     console.log("Booking data", bookingData);
//     try {
//       const { data, status } = await AxiosClient.post(
//         "/api/add-booking",
//         bookingData
//       );
//       if (status === 201) {
//         console.log("response data", data);
//         navigate("/login");
//       } else {
//         // Handle error response
//         console.error("Failed to create booking");
//       }
//     } catch (error) {
//       // Handle fetch error
//       console.error("Error creating booking:", error);
//     }
//   };

//   return (
//     <>
//       {/* <Header /> */}
//       <BreadCrumbs title={"Review Booking"} />
//       <div className="loginOuter">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-12 mx-auto">
//               <div className="card">
//                 <div className="reviewDetails">
//                   <div className="row">
//                     <div className="col-lg-3 col-sm-12 col-md-6">
//                       <p>
//                         <strong>Destination</strong>
//                         <span> {formData.destination}</span>
//                         0.31 km away
//                       </p>
//                     </div>

//                     <div className="col-lg-3 col-sm-12 col-md-6">
//                       <p>
//                         <strong>Date & Time</strong>
//                         <span>
//                           From :{formData.from}&nbsp;
//                           {formData.from_time}
//                         </span>
//                         <span>
//                           To :{formData.to}&nbsp;
//                           {formData.to_time}
//                         </span>
//                       </p>
//                     </div>

//                     <div className="col-lg-2 col-sm-12 col-md-6">
//                       <p>
//                         <strong>Vehicle Details</strong>
//                         {/* <span>{formData.vehicle_type}</span> */}

//                         <span>
//                           {formData.hours}
//                           hours
//                         </span>
//                       </p>
//                     </div>

//                     <div className="col-lg-2 col-sm-12 col-md-6">
//                       <p>
//                         <strong>No. of Vehicles</strong>
//                         {formData.no_of_vehicle}
//                       </p>
//                     </div>

//                     <div className="col-lg-2 col-sm-12 col-md-6">
//                       <p>
//                         <strong>Amount</strong>
//                         <span>
//                           ${formData.no_of_vehicle * formData.hours * 10}
//                         </span>
//                       </p>
//                     </div>
//                   </div>

//                   <div className="row">
//                     <div className="col-lg-12 col-lg-12 col-sm-12 col-md-12 text-center">
//                       <button
//                         onClick={handleSubmit}
//                         className="btn btn-primary"
//                         type="button"
//                       >
//                         Confirm
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ParkingSpace />
//       <Footer />
//     </>
//   );
// };

// export default ReviewBookingOld;
