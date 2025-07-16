import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { searchSubmit } from "../redux/searchSlice";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

interface SearchProps {
  title: string;
  handleApi: () => void;
}

interface RootState {
  search: {
    value: SearchState;
  };
}

interface SearchState {
  from: string;
  to: string;
  selectedFromTime: string;
  selectedToTime: string;
  destination: any; // Changed from string to any (or use the correct type from GooglePlacesAutocomplete)
  vehicle_type: string;
  event: string;
}

interface ErrorState {
  from?: string;
  to?: string;
  event?: string;
  destination?: string;
  selectedFromTime?: string;
  selectedToTime?: string;
  vehicle_type?: string;
}

const Search = ({ title, handleApi }: SearchProps) => {
  const searchState = useSelector((state: RootState) => state.search.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formIsValid, setFormIsValid] = useState(false);
  const [formData, setFormData] = useState<SearchState>({
    from: "",
    to: "",
    selectedFromTime: "",
    selectedToTime: "",
    event: "",
    destination: null, // Changed from "" to null
    vehicle_type: "",
  });

  const [error, setError] = useState<ErrorState>({});

  const onChange = (name: keyof SearchState, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrorState: ErrorState = {};

    if (!formData.from) newErrorState.from = "From date is required";
    if (!formData.to) newErrorState.to = "To date is required";
    if (!formData.destination) newErrorState.destination = "Destination is required";
    if (!formData.selectedFromTime) newErrorState.selectedFromTime = "Time is required";
    if (!formData.selectedToTime) newErrorState.selectedToTime = "Time is required";

    if (Object.values(newErrorState).some((v) => v)) {
      setError(newErrorState);
      setFormIsValid(false);
      return;
    }

    setFormIsValid(true);
    dispatch(
      searchSubmit({
        data: {
          ...formData,
          from: new Date(formData.from).toISOString(),
          to: new Date(formData.to).toISOString(),
        },
      })
    );

    if (location.pathname === "/") navigate("/listing");
    else if (location.pathname === "/listing") handleApi();
  };

  const CustomDatePickerInput = ({ value, onClick }: any) => (
    <div className="input-group date picker-date" id="datepicker">
      <input
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

  const generateTimeOptions = () => {
    return Array.from({ length: 91 }, (_, index) => {
      const time = new Date(0, 0, 0, 0, 60 * index);
      return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    });
  };

  return (
    <div className="searchOuterInner">
      <div className="container searchOuter">
        <h2>{title}</h2>
        <form onSubmit={onSubmit}>
          <div className="row">
            {/* FROM */}
            <div className="form-group mb-3 col">
              <label>From<span className="text-danger">*</span></label>
              <div className="picker">
                <DatePicker
                  minDate={new Date()}
                  selected={formData.from as any}
                  customInput={<CustomDatePickerInput />}
                  onChange={(date) => onChange("from", date)}
                />
                <select
                  className="form-control style-2"
                  value={formData.selectedFromTime}
                  onChange={(e) => onChange("selectedFromTime", e.target.value)}
                >
                  {generateTimeOptions().map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              {error.from && <span className="text-danger">{error.from}</span>} &nbsp;
              {error.selectedFromTime && <span className="text-danger">{error.selectedFromTime}</span>}
            </div>

            {/* TO */}
            <div className="form-group mb-3 col">
              <label>To<span className="text-danger">*</span></label>
              <div className="picker">
                <DatePicker
                  minDate={new Date(formData.from)}
                  selected={formData.to as any}
                  customInput={<CustomDatePickerInput />}
                  onChange={(date) => onChange("to", date)}
                />
                <select
                  className="form-control style-2"
                  value={formData.selectedToTime}
                  onChange={(e) => onChange("selectedToTime", e.target.value)}
                >
                  {generateTimeOptions().map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              {error.to && <span className="text-danger">{error.to}</span>} &nbsp;
              {error.selectedToTime && <span className="text-danger">{error.selectedToTime}</span>}
            </div>

            {/* DESTINATION */}
            <div className="form-group mb-3 col">
              <label>Destination<span className="text-danger">*</span></label>
              <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}
                selectProps={{
                  value: formData.destination,
                  onChange: (value) => onChange("destination", value),
                }}
              />
              {error.destination && <span className="text-danger">{error.destination}</span>}
            </div>

            {/* SUBMIT */}
            <div className="form-group mb-3 col-lg-12 col-xl-12 col-sm-6 col-md-12 text-center">
              <button type="submit" className="btn btn-primary">Search Now</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;










// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import { useDispatch, useSelector } from "react-redux";
// import { searchSubmit } from "../redux/searchSlice";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";

// const Search = ({ title, handleApi }) => {
//   const searchState = useSelector((state) => {
//     return state.search.value;
//   });

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [formIsValid, setFormIsValid] = useState(false);
//   const [formData, setFormData] = useState({
//     from: "",
//     to: "",
//     selectedFromTime: "",
//     selectedToTime: "",
//     event: "",
//     destination: "",
//     vehicle_type: "",
//   });
//   console.log("Search State", searchState);
//   // const [formData, setFormData] = useState({
//   //   from: searchState.from,
//   //   to: searchState.to,
//   //   selectedFromTime: searchState.selectedFromTime,
//   //   selectedToTime: searchState.selectedToTime,
//   //   event: "",
//   //   destination: searchState.destination,
//   //   vehicle_type: "",
//   // });
//   const [error, setError] = useState({
//     from: "",
//     to: "",
//     event: "",
//     destination: "",
//     selectedToTime: "",
//     selectedFromTime: "",
//   });

//   // Load state from localStorage on component mount
//   // useEffect(() => {

//   //   const savedFormData = localStorage.getItem("formData");
//   //   if (savedFormData) {
//   //     setFormData(JSON.parse(savedFormData));
//   //   }
//   // }, []);

//   const onChange = (name, value) => {
//     console.log("on change value", name, value);
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
//     console.log("Useeffect error", error);
//   }, [error]);

//   // useEffect(() => {
//   //   setFormData((state) => ({
//   //     ...state,
//   //     from: combineDateTime(state.from, state.selectedFromTime),
//   //   }));
//   // }, [formData.selectedFromTime]);

//   // useEffect(() => {
//   //   setFormData((state) => ({
//   //     ...state,
//   //     to: combineDateTime(state.to, state.selectedToTime),
//   //   }));
//   // }, [formData.selectedToTime]);

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form fields
//     const newErrorState = { ...error };

//     if (!formData.from) {
//       newErrorState.from = "From date is required";
//     }

//     if (!formData.to) {
//       newErrorState.to = "To date is required";
//     }

//     if (!formData.destination) {
//       newErrorState.destination = "Destination is required";
//     }

//     if (!formData.selectedFromTime) {
//       newErrorState.selectedFromTime = "Time is required";
//     }

//     if (!formData.selectedToTime) {
//       newErrorState.selectedToTime = "Time is required";
//     }
//     // if (!formData.vehicle_type) {
//     //   newErrorState.vehicle_type = "Vehicle Type is required";
//     // }

//     // Check if there are any errors
//     if (Object.values(newErrorState).some((value) => value !== "")) {
//       console.log("new errorstate", newErrorState);
//       setError((state) => newErrorState);
//       setFormIsValid(false);
//       return;
//     }

//     // If all fields are valid, set formIsValid to true
//     setFormIsValid(true);
//     // Add your logic for handling form submission here

//     dispatch(
//       searchSubmit({
//         data: {
//           ...formData,
//           from: formData.from.toISOString(),
//           to: formData.to.toISOString(),
//         },
//       })
//     );
//     if (location.pathname === "/") {
//       navigate("/listing");
//     }
//     if (location.pathname === "/listing") {
//       handleApi();
//     }
//   };

//   const CustomDatePickerInput = ({ value, onClick }) => (
//     <>
//       <div className="input-group date picker-date" id="datepicker">
//         <input
//           type="text"
//           className="form-control style-2 border-right"
//           value={value}
//           onClick={onClick}
//           placeholder="Choose Date"
//         />
//         <span className="input-group-append" onClick={onClick}>
//           <span className="input-group-text bg-white d-block">
//             <i className="fa fa-calendar"></i>
//           </span>
//         </span>
//       </div>
//     </>
//   );

//   return (
//     <>
//       <div className="searchOuterInner">
//         <div className="container searchOuter">
//           <h2>{title}</h2>
//           <form onSubmit={onSubmit}>
//             <div className="row">
//               <div className="form-group mb-3 col">
//                 <label>
//                   From<span className="text-danger">*</span>
//                 </label>
//                 <div className="picker">
//                   <DatePicker
//                     minDate={new Date()}
//                     selected={formData.from}
//                     customInput={<CustomDatePickerInput />}
//                     onChange={
//                       (date) => onChange("from", date)
//                       // setFormData({ ...formData, from: date })
//                     }
//                   />
//                   <select
//                     className="form-control style-2"
//                     value={formData.selectedFromTime}
//                     onChange={(e) =>
//                       onChange("selectedFromTime", e.target.value)
//                     }
//                   >
//                     {/* Populate options for time selection */}
//                     {Array.from({ length: 91 }, (_, index) => {
//                       const time = new Date(0, 0, 0, 0, 60 * index);
//                       const formattedTime = time.toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true,
//                       });
//                       return (
//                         <option key={index} value={formattedTime}>
//                           {formattedTime}
//                         </option>
//                       );
//                     })}
//                   </select>
//                 </div>
//                 {error.from && (
//                   <span className="text-danger">{error.from}</span>
//                 )}
//                 &nbsp;
//                 {error.selectedFromTime && (
//                   <span className="text-danger">{error.selectedFromTime}</span>
//                 )}
//               </div>

//               <div className="form-group mb-3 col">
//                 <label>
//                   To<span className="text-danger">*</span> &nbsp; &nbsp;
//                 </label>
//                 <div className="picker">
//                   <DatePicker
//                     minDate={new Date(formData.from)}
//                     selected={formData.to}
//                     customInput={<CustomDatePickerInput />}
//                     onChange={(date) => onChange("to", date)}
//                   />
//                   <select
//                     className="form-control style-2"
//                     value={formData.selectedToTime}
//                     onChange={(e) => onChange("selectedToTime", e.target.value)}
//                   >
//                     {/* Populate options for time selection */}
//                     {Array.from({ length: 91 }, (_, index) => {
//                       const time = new Date(0, 0, 0, 0, 60 * index);
//                       const formattedTime = time.toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true,
//                       });
//                       return (
//                         <option key={index} value={formattedTime}>
//                           {formattedTime}
//                         </option>
//                       );
//                     })}
//                   </select>
//                 </div>
//                 {error.to && <span className="text-danger">{error.to}</span>}
//                 &nbsp;
//                 {error.selectedToTime && (
//                   <span className="text-danger">{error.selectedToTime}</span>
//                 )}
//               </div>

//               <div className="form-group mb-3 col">
//                 <label>
//                   Destination<span className="text-danger">*</span>
//                 </label>
//                 <GooglePlacesAutocomplete
//                   apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}
//                   selectProps={{
//                     apiValue: formData.destination,
//                     // onChange: (e) => onChange("destination", e.target.value),

//                     onChange: (value) => onChange("destination", value),
//                   }}
//                 />
//                 {/* <input
//                   type="text"
//                   className="form-control style-2"
//                   placeholder="Search your location"
//                   value={formData.destination}
//                   onChange={(e) => onChange("destination", e.target.value)}
//                 /> */}
//                 {error.destination && (
//                   <span className="text-danger">{error.destination}</span>
//                 )}
//               </div>

//               {/* <div className="form-group mb-3 col">
//             <label>Popular Events</label>
//             <select className="form-control style-2">
//               <option>Chicago - The Band</option>
//             </select>
//           </div> */}
//               {/* <div className="form-group mb-3 col">
//             <label>Vehicle Type</label>
//             <select
//               className="form-control style-2"
//               name="vehicle_type"
//               value={formData.vehicle_type}
//               onChange={(e) => onChange("vehicle_type", e.target.value)}
//             >
//               <option value="">Select Vehicle Type</option>
//               <option value="SUV">SUV</option>

             
//             </select>
//             {error.vehicle_type && (
//               <span className="text-danger">{error.vehicle_type}</span>
//             )}
//             </div>*/}

//               <div className="form-group mb-3 col-lg-12 col-xl-12 col-sm-6 col-md-12 text-center">
//                 <button type="submit" className="btn btn-primary">
//                   Search Now
//                 </button>
//               </div>
//             </div>
//           </form>

//           {/* {search && parkingListData.length > 0 && (
//         <ParkingList data={parkingListData} />
//       )} */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Search;
