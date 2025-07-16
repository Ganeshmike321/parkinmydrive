import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

import Header from "./Header";
import Footer from "./Footer";
import BreadCrumbs from "./BreadCrumbs";
import Loader from "./Loader";

import { formatDate } from "../utils/DateTime";
import { getLatLong } from "../utils/GoogleApi";
import OwnerAxiosClient from "../axios/OwnerAxiosClient";

interface ApiValueType {
  label: string;
  value: {
    place_id: string;
  };
}

interface FormData {
  slot_name: string;
  google_map: string;
  latitude: number;
  longitude: number;
  from_date_time: string;
  to_date_time: string;
  vehicle_fees: string;
  nearby_places: string;
  available_time: string;
  available_slots: number;
}

const EditParkingSpot = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [data, setData] = useState<any>(null);
  const [apiValue, setApiValue] = useState<ApiValueType | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (apiValue?.value?.place_id) {
      const fetchCoordinates = async () => {
        const { lat, lng } = await getLatLong(apiValue.value.place_id);
        setValue("google_map", apiValue.label);
        if (lat && lng) {
          setValue("latitude", lat);
          setValue("longitude", lng);
        }
      };
      fetchCoordinates();
    }
  }, [apiValue, setValue]);

  useEffect(() => {
    if (state) {
      setData(state);
      setValue("latitude", state.latitude);
      setValue("longitude", state.longitude);
      setValue("slot_name", state.slot_name);
      setValue("from_date_time", state.from_date_time);
      setValue("to_date_time", state.to_date_time);
      setValue("available_slots", 1);
      setValue("nearby_places", state.nearby_places);
      setValue("vehicle_fees", state.vehicle_fees);
      setValue("available_time", state.available_time);
      setValue("google_map", state.google_map);

      setFromDate(new Date(state.from_date_time));
      setToDate(new Date(state.to_date_time));
    }
  }, [state, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true);
      const response = await OwnerAxiosClient.put(`/api/parking-spots/${data.id}`, formData);
      if (response.status === 200) {
        toast.success("Parking spot updated successfully!");
        navigate("/my-parking-spot");
      } else if (response.status === 409) {
        toast.error("Parking spot already exists");
      }
    } catch (error) {
      toast.error("Failed to update parking spot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CustomDatePickerInput = ({ value, onClick }: any) => (
    <div className="input-group date picker-date width-100" id="datepicker">
      <input
        required
        type="text"
        className="form-control style-2 border-right"
        value={value}
        onClick={onClick}
        placeholder="Choose Date"
        readOnly
      />
      <span className="input-group-append" onClick={onClick}>
        <span className="input-group-text bg-white d-block">
          <i className="fa fa-calendar"></i>
        </span>
      </span>
    </div>
  );

  return (
    <div>
      <BreadCrumbs title="Edit Parking Slot" />
      <div className="loginOuter afterownerLogin">
        <div className="container">
          <div className="dashboardList">
            <div className="row tabContentOuter">
              <div className="col-lg-12 col-md-12 mx-auto">
                <h3>Parking Slot Details</h3>
                <div className="card mb-4 mt-2">
                  <div className="card-body corporateMenu">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row">
                        <div className="col-lg-9 col-md-12 mx-auto mt-3">

                          {/* Slot Name */}
                          <div className="form-group row">
                            <label className="control-label col-xl-3">Slot Name</label>
                            <div className="col-xl-5">
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={data?.slot_name}
                                {...register("slot_name", { required: true })}
                              />
                              {errors.slot_name && <span className="text-danger">This field is required</span>}
                            </div>
                          </div>

                          {/* Address */}
                          <div className="form-group row">
                            <label className="control-label col-xl-3">Address</label>
                            <div className="col-xl-5">
                              <span>{data?.google_map}</span>
                              <GooglePlacesAutocomplete
                                apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}
                                selectProps={{ value: apiValue, onChange: setApiValue }}
                              />
                              {errors.google_map && <span className="text-danger">This field is required</span>}
                            </div>
                          </div>

                          {/* From Date */}
                          <div className="form-group row">
                            <label className="control-label col-xl-3">Available From Date</label>
                            <div className="col-xl-5">
                              <DatePicker
                                minDate={new Date()}
                                selected={fromDate}
                                customInput={<CustomDatePickerInput />}
                                onChange={(date: Date | null) => {
                                  if (date) {
                                    setFromDate(date);
                                    setValue("from_date_time", formatDate(date.toISOString()));
                                    setToDate(date);
                                    setValue("to_date_time", formatDate(date.toISOString()));
                                  }
                                }}
                              />
                              {errors.from_date_time && <span className="text-danger">This field is required</span>}
                            </div>
                          </div>

                          {/* To Date */}
                          <div className="form-group row">
                            <label className="control-label col-xl-3">Available To Date</label>
                            <div className="col-xl-5">
                              <DatePicker
                                minDate={fromDate || new Date()}
                                selected={toDate}
                                customInput={<CustomDatePickerInput />}
                                onChange={(date: Date | null) => {
                                  if (date) {
                                    setToDate(date);
                                    setValue("to_date_time", formatDate(date.toISOString()));
                                  }
                                }}
                              />
                              {errors.to_date_time && <span className="text-danger">This field is required</span>}
                            </div>
                          </div>

                          {/* Fees */}
                          <div className="form-group row">
                            <label className="control-label col-xl-3">Fees</label>
                            <div className="col-xl-5">
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={data?.vehicle_fees}
                                {...register("vehicle_fees", { required: true })}
                              />
                              {errors.vehicle_fees && <span className="text-danger">This field is required</span>}
                            </div>
                          </div>

                          {/* Comment */}
                          <div className="form-group row">
                            <label className="control-label col-xl-3">Comment</label>
                            <div className="col-xl-5">
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={data?.nearby_places}
                                {...register("nearby_places", { required: true })}
                              />
                              {errors.nearby_places && <span className="text-danger">This field is required</span>}
                            </div>
                          </div>

                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-9 col-md-12 mx-auto">
                          <div className="form-group row">
                            <div className="col-md-12 col-lg-3 mx-auto d-flex justify-content-center">
                              <button type="submit" className="btn btn-primary btn-sm me-5">
                                {loading ? <Loader /> : "Save"}
                              </button>
                              <NavLink to="/my-parking-spot" className="d-flex m-2">Back</NavLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditParkingSpot;


// import DatePicker from "react-datepicker";
// import BreadCrumbs from "./BreadCrumbs";
// import Footer from "./Footer";
// import Header from "./Header";
// import Loader from "./Loader";
// import { formatDate } from "../utils/DateTime";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getLatLong } from "../utils/GoogleApi";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import OwnerAxiosClient from "../axios/OwnerAxiosClient";

// const EditParkingSpot = () => {
//   const { state } = useLocation();
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm();
//   const [data, setData] = useState(null);
//   const [apiValue, setApiValue] = useState(null);
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("Api value", apiValue);
//     console.log("placeId api", apiValue?.value?.place_id);
//     const getUtil = async () => {
//       if (apiValue !== null) {
//         const { lat, lng } = await getLatLong(apiValue?.value?.place_id);
//         console.log("callback", lat, lng);
//         setValue("google_map", apiValue?.label);
//         if (lat && lng) {
//           setValue("latitude", String(lat));
//           setValue("longitude", String(lng));
//         }
//       }
//     };
//     getUtil();
//   }, [apiValue]);

//   useEffect(() => {
//     if (state) {
//       setData(state);
//       setValue("latitude", state.latitude);
//       setValue("longitude", state.longitude);
//       setValue("slot_name", state.slot_name);
//       setValue("from_date_time", state.from_date_time);
//       setValue("to_date_time", state.to_date_time);
//       setValue("available_slots", 1);
//       setValue("nearby_places", state.nearby_places);
//       setValue("vehicle_fees", state.vehicle_fees);
//       setValue("available_time", state.available_time);
//       // Set the initial value for the GooglePlacesAutocomplete component
//       setValue("google_map", state.google_map);

//       setFromDate(new Date(state.from_date_time));
//       setToDate(new Date(state.to_date_time));
//     }
//   }, [state, setValue]);

//   useEffect(() => {
//     console.log("Errors", errors);
//   }, [errors]);

//   const onSubmit = async (formData) => {
//     console.log("Edit formdata", formData);
//     // Handle form submission logic here
//     try {
//       setLoading(true);

//       const response = await OwnerAxiosClient.put(
//         `/api/parking-spots/${data.id}`,
//         formData
//       );
//       console.log("Updated parking spot:", response.data);
//       if (response.status === 200) {
//         setLoading(false);
//         toast.success("Parking spot updated successfully!");
//         navigate("/my-parking-spot");
//       } else if (response.status === 409) {
//         toast.error("Parking spot already exists");
//       }
//     } catch (error) {
//       console.error("Error updating parking spot:", error);
//       toast.error("Failed to update parking spot. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const CustomDatePickerInput = ({ value, onClick }) => {
//     console.log("date ", value);
//     return (
//       <>
//         <div className="input-group date picker-date width-100" id="datepicker">
//           <input
//             required
//             type="text"
//             className="form-control style-2 border-right"
//             value={value}
//             onClick={onClick}
//             placeholder="Choose Date"
//           />
//           <span className="input-group-append" onClick={onClick}>
//             <span className="input-group-text bg-white d-block">
//               <i className="fa fa-calendar"></i>
//             </span>
//           </span>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div>
//       {/* <Header /> */}
//       <BreadCrumbs title="Edit Parking Slot" />

//       <div className="loginOuter afterownerLogin">
//         <div className="container">
//           <div className="dashboardList">
//             <div className="row tabContentOuter">
//               <div className="col-lg-12 col-md-12 mx-auto">
//                 <div className="d-flex align-items-center justify-content-between">
//                   <h3>Parking Slot Details</h3>
//                   {/* <NavLink onClick={(e) => {
//                     e.preventDefault();
//                     navigate(-1);
//                   }}>Back</NavLink> */}
//                 </div>
//                 <div className="card mb-4 mt-2">
//                   <div className="card-body corporateMenu">
//                     <form onSubmit={handleSubmit(onSubmit)}>
//                       <div className="row">
//                         <div className="col-lg-9 col-md-12 mx-auto mt-3">

//                           {/* Slot Name */}
//                           <div className="form-group row">
//                             <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                               Slot Name
//                             </label>
//                             <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                               <input
//                                 type="text"
//                                 id="name"
//                                 name="name"
//                                 className="form-control "
//                                 defaultValue={data?.slot_name}
//                                 {...register("slot_name", {
//                                   required: true,
//                                 })}
//                               />
//                               {errors?.slot_name && (
//                                 <span className="text-danger">
//                                   This field is required
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           {/* Google map */}
//                           <div className="form-group row">
//                             <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                               Address
//                             </label>
//                             <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                               <span>{data?.google_map}</span>
//                               <GooglePlacesAutocomplete
//                                 apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}
//                                 selectProps={{
//                                   // apiValue,
//                                   value: apiValue,
//                                   onChange: setApiValue,
//                                 }}
//                                 {...register("google_map", {
//                                   required: true,
//                                 })}
//                               />
//                               {errors?.google_map && (
//                                 <span className="text-danger">
//                                   This field is required
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           {/* Latitude */}
//                           {/* <div className="form-group row">
//                             <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                               Latitude
//                             </label>
//                             <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                               <input
//                                 type="text"
//                                 id="email"
//                                 name="email"
//                                 className="form-control "
//                                 disabled
//                                 defaultValue={data?.latitude}
//                                 {...register("latitude", {
//                                   required: true,
//                                 })}
//                               />
//                               {errors?.latitude && (
//                                 <span className="text-danger">
//                                   This field is required
//                                 </span>
//                               )}
//                             </div>
//                           </div> */}

//                           {/* Longitude */}
//                           {/* <div className="form-group row">
//                             <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                               Longitude
//                             </label>
//                             <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                               <input
//                                 type="text"
//                                 id="email"
//                                 name="email"
//                                 className="form-control "
//                                 disabled
//                                 defaultValue={data?.longitude}
//                                 {...register("longitude", {
//                                   required: true,
//                                 })}
//                               />
//                               {errors?.longitude && (
//                                 <span className="text-danger">
//                                   This field is required
//                                 </span>
//                               )}
//                             </div>
//                           </div> */}

//                           {/* From Date */}
//                           <div className="form-group row">
//                             <label
//                               htmlFor="from_date_time"
//                               className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12"
//                             >
//                               Available From Date
//                             </label>
//                             <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                               <DatePicker
//                                 minDate={new Date()}
//                                 selected={fromDate}
//                                 name="from_date_time"
//                                 required
//                                 customInput={<CustomDatePickerInput />}
//                                 onChange={(date) => {
//                                   setFromDate(date);
//                                   setValue("from_date_time", formatDate(date));
//                                   setToDate(date);
//                                   setValue("to_date_time", formatDate(date));
//                                 }}
//                               />
//                               {errors?.from_date_time && (
//                                 <span className="text-danger">This field is required</span>
//                               )}
//                             </div>
//                           </div>

//                           {/* To Date */}
//                           <div className="form-group row">
//                             <label
//                               htmlFor="to_date_time"
//                               className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12"
//                             >
//                               Available To Date
//                             </label>
//                             <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                               <DatePicker
//                                 minDate={fromDate}
//                                 selected={toDate}
//                                 name="to_date_time"
//                                 required
//                                 customInput={<CustomDatePickerInput />}
//                                 defaultValue={data?.to_date_time}
//                                 onChange={(date: Date | null) => {
//                                   setToDate(date);
//                                   if (date) setValue("to_date_time", formatDate(date));
//                                 }}
//                               />
//                               {errors?.to_date_time && (
//                                 <span className="text-danger">This field is required</span>
//                               )}
//                             </div>
//                           </div>


//                           {/* Vehicle Fees */}
//                           <div className="form-group row">
//                             <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                               Fees
//                             </label>
//                             <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                               <input
//                                 type="text"
//                                 className="form-control "
//                                 defaultValue={data?.vehicle_fees}
//                                 {...register("vehicle_fees", {
//                                   required: true,
//                                 })}
//                               />
//                               {errors?.vehicle_fees && (
//                                 <span className="text-danger">
//                                   This field is required
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           {/* Comment */}
//                           <div className="form-group row">
//                             <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                               Comment
//                             </label>
//                             <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                               <input
//                                 type="text"
//                                 id="email"
//                                 name="email"
//                                 className="form-control "
//                                 defaultValue={data?.nearby_places}
//                                 {...register("nearby_places", {
//                                   required: true,
//                                 })}
//                               />
//                               {errors?.nearby_places && (
//                                 <span className="text-danger">
//                                   This field is required
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           {/* Available Time */}
//                           {/* <div className="form-group row">
//                             <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                               Available Time
//                             </label>
//                             <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                               <input
//                                 type="text"
//                                 id="designation"
//                                 name="designation"
//                                 readOnly
//                                 className="form-control "
//                                 defaultValue={data?.available_time}
//                                 {...register("available_time", {
//                                   required: true,
//                                 })}
//                               />

//                               {errors?.available_time && (
//                                 <span className="text-danger">
//                                   This field is required
//                                 </span>
//                               )}
//                             </div>
//                           </div> */}
//                           {/* <div className="form-group row">
//                               <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                                 Photos
//                               </label>
//                               <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                                 {data?.photos &&
//                                   data?.photos.map((item) => {
//                                     return (
//                                       <img
//                                         style={{
//                                           height: "100px",
//                                           width: "120px",
//                                         }}
//                                         key={item.id}
//                                         src={`http://localhost:8000/storage/${item.photo_path.slice(
//                                           6
//                                         )}`}
//                                         alt={item.id}
//                                       />
//                                     );
//                                   })}
//                               </div>
//                             </div> */}


//                           {/* Available Slots */}
//                           {/* <div className="form-group row">
//                             <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                               Parking Slots Available
//                             </label>
//                             <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                               <input
//                                 type="text"
//                                 id="email"
//                                 name="email"
//                                 className="form-control "
//                                 defaultValue={data?.available_slots}
//                                 {...register("available_slots", {
//                                   required: true,
//                                 })}
//                               />
//                               {errors?.available_slots && (
//                                 <span className="text-danger">
//                                   This field is required
//                                 </span>
//                               )}
//                             </div>
//                           </div> */}

//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-lg-9 col-md-12 mx-auto">
//                           <div className="form-group row">
//                             <div className="col-md-12 col-lg-3 mx-auto d-flex justify-content-center">
//                               <button
//                                 type="submit"
//                                 className="btn btn-primary btn-sm me-5"
//                               >
//                                 {loading ? (
//                                   <div className="loader">
//                                     <Loader />
//                                   </div>
//                                 ) : (
//                                   "Save"
//                                 )}
//                               </button>
//                               <NavLink to="/my-parking-spot" className='d-flex m-2'>
//                               Back
//                             </NavLink>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>

//                 {/* <h3> Vehicle Types &amp; Fees</h3>
//                   <div className="card mb-4 mt-2">
//                     <div className="card-body corporateMenu">
//                       <form name="addUser" id="addUser">
//                         <div className="row">
//                           <div className="col-lg-9 col-md-12 mx-auto mt-3">
//                             <div className="form-group row">
//                               <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                                 Vehicle Types
//                               </label>
//                               <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                                 <select className="form-control">
//                                   <option defaultValue="Hatchback">Hatchback</option>
//                                   <option value="Sedan">Sedan</option>
//                                   <option value="SUVs">SUVs</option>
//                                 </select>
//                               </div>
//                             </div>

//                             <div className="form-group row">
//                               <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                                 Parking Fees
//                               </label>
//                               <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                                 <div className="row">
//                                   <div className="col-xl-8 col-lg-8 col-md-6 col-sm-6 col-xs-12 perhourfields">
//                                     <div>
                                      
//                                       <label className="checkboxField">
                                        
//                                         Per Hour
//                                         <input
//                                           type="checkbox"
//                                           checked="checked"
//                                         />
//                                         <span className="checkmark"></span>
//                                       </label>
//                                       <span className="perhoursfees">
                                        
//                                         $
//                                         <input
//                                           type="text"
//                                           id="email"
//                                           name="email"
//                                           className="form-control "
//                                           value=""
//                                           placeholder=""
//                                         />
//                                       </span>
//                                     </div>

//                                     <div>
                                      
//                                       <label className="checkboxField">
                                        
//                                         4 Hours
//                                         <input
//                                           type="checkbox"
//                                           checked="checked"
//                                         />
//                                         <span className="checkmark"></span>
//                                       </label>
//                                       <span className="perhoursfees">
                                        
//                                         $
//                                         <input
//                                           type="text"
//                                           id="email"
//                                           name="email"
//                                           className="form-control "
//                                           value=""
//                                           placeholder=""
//                                         />
//                                       </span>
//                                     </div>

//                                     <div>
                                      
//                                       <label className="checkboxField">
                                        
//                                         8 Hours
//                                         <input
//                                           type="checkbox"
//                                           checked="checked"
//                                         />
//                                         <span className="checkmark"></span>
//                                       </label>
//                                       <span className="perhoursfees">
                                        
//                                         $
//                                         <input
//                                           type="text"
//                                           id="email"
//                                           name="email"
//                                           className="form-control "
//                                           value=""
//                                           placeholder=""
//                                         />
//                                       </span>
//                                     </div>

//                                     <div>
                                      
//                                       <label className="checkboxField">
                                        
//                                         12 Hours
//                                         <input
//                                           type="checkbox"
//                                           checked="checked"
//                                         />
//                                         <span className="checkmark"></span>
//                                       </label>
//                                       <span className="perhoursfees">
                                        
//                                         $
//                                         <input
//                                           type="text"
//                                           id="email"
//                                           name="email"
//                                           className="form-control "
//                                           value=""
//                                           placeholder=""
//                                         />
//                                       </span>
//                                     </div>

//                                     <div>
                                      
//                                       <label className="checkboxField">
                                        
//                                         24 Hours
//                                         <input
//                                           type="checkbox"
//                                           checked="checked"
//                                         />
//                                         <span className="checkmark"></span>
//                                       </label>
//                                       <span className="perhoursfees">
                                        
//                                         $
//                                         <input
//                                           type="text"
//                                           id="email"
//                                           name="email"
//                                           className="form-control "
//                                           value=""
//                                           placeholder=""
//                                         />
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="form-group row">
//                               <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12"></label>
//                               <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                                 <span
//                                   className="label"
//                                   style={{
//                                     display: "block",
//                                     textAlign: "right",
//                                     fontWeight: "bold",
//                                     textDecoration: "underline",
//                                   }}
//                                 >
//                                   + Add Vehicle
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   </div> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default EditParkingSpot;
