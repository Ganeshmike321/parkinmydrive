
import React, { useEffect, useState } from "react";
import BreadCrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import { NavLink, useLocation } from "react-router-dom";
import moment from "moment";

interface User {
  name: string;
}

interface BookingData {
  user: User;
  from_datetime: string;
  to_datetime: string;
  booked_on: string;
  vehicle_number: string;
  slot: string;
  amount_paid: number;
  total_hours: number;
}

const ViewBookingSlot: React.FC = () => {
  const { state } = useLocation();
  const [data, setData] = useState<BookingData | null>(null);

  useEffect(() => {
    setData(state as BookingData);
  }, [state]);

  return (
    <div>
      <BreadCrumbs title="View Slot Bookings" />
      <div className="loginOuter afterownerLogin">
        <div className="container">
          <div className="dashboardList">
            <div className="row tabContentOuter">
              <div className="col-lg-12 col-md-12 mx-auto">
                <div className="d-flex align-items-center justify-content-between">
                  <h3>Bookings slot</h3>
                </div>
                <div className="card mb-4 mt-2">
                  <div className="card-body corporateMenu">
                    <div className="row">
                      <div className="col-lg-9 col-md-12 mx-auto mt-3">
                        {data && (
                          <>
                            <div className="form-group row">
                              <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                Name
                              </label>
                              <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <span className="label">{data.user.name}</span>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                From Date & Time
                              </label>
                              <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <span className="label">{moment(data.from_datetime).format("MM-DD-YYYY hh:mm")}</span>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                To Date & Time
                              </label>
                              <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <span className="label">{moment(data.to_datetime).format("MM-DD-YYYY hh:mm")}</span>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                Booked On
                              </label>
                              <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <span className="label">{moment(data.booked_on).format("MM-DD-YYYY hh:mm")}</span>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                Vehicle Number
                              </label>
                              <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <span className="label">{data.vehicle_number}</span>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                Slot
                              </label>
                              <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <span className="label">{data.slot}</span>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                Amount Paid
                              </label>
                              <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <span className="label">${data.amount_paid}</span>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                Total Hours
                              </label>
                              <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <span className="label">{data.total_hours}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <NavLink to="/my-slot-bookings" className="d-flex p-3 justify-content-center">
                  Back
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewBookingSlot;









// import React, { useEffect, useState } from "react";
// import Header from "./Header";
// import BreadCrumbs from "./BreadCrumbs";
// import Footer from "./Footer";
// import { NavLink, useLocation } from "react-router-dom";
// import moment from 'moment';
// const ViewBookingSlot = () => {
//   const { state } = useLocation();
//   const [data, setData] = useState(null);
//   useEffect(() => {
//     setData(state);
//   }, [state]);
//   return (
//     <div>
//       {/* <Header /> */}
//       <BreadCrumbs title="View Slot Bookings" />
//       <div className="loginOuter afterownerLogin">
//         <div className="container">
//           <div className="dashboardList">
//             <div className="row tabContentOuter">
//               <div className="col-lg-12 col-md-12 mx-auto">
//                 <div className="d-flex align-items-center justify-content-between">
//                   <h3>Bookings slot</h3>
//                 </div>
//                 <div className="card mb-4 mt-2">
//                   <div className="card-body corporateMenu">
//                     <div className="row">
//                       <div className="col-lg-9 col-md-12 mx-auto mt-3">
//                         <div className="form-group row">
//                           <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                             Name
//                           </label>
//                           <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                             <span className="label">{data?.user.name}</span>
//                           </div>
//                         </div>
//                         <div className="form-group row">
//                           <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                             From Date & Time
//                           </label>
//                           <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                             <span className="label">{moment(data?.from_datetime).format('MM-DD-YYYY hh:mm')}</span>
//                           </div>
//                         </div>
//                         <div className="form-group row">
//                           <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                             To Date & Time
//                           </label>
//                           <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                             <span className="label">{moment(data?.to_datetime).format('MM-DD-YYYY hh:mm')}</span>
//                           </div>
//                         </div>

//                         <div className="form-group row">
//                           <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                             Booked On
//                           </label>
//                           <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                             <span className="label">{moment(data?.booked_on).format('MM-DD-YYYY hh:mm')}</span>
//                           </div>
//                         </div>
//                         <div className="form-group row">
//                           <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                             Vehicle Number
//                           </label>
//                           <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                             <span className="label">
//                               {data?.vehicle_number}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="form-group row">
//                           <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                             Slot
//                           </label>
//                           <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                             <span className="label">{data?.slot}</span>
//                           </div>
//                         </div>
//                         <div className="form-group row">
//                           <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                             Amount Paid
//                           </label>
//                           <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                             <span className="label">${data?.amount_paid}</span>
//                           </div>
//                         </div>
//                         {/* <div className="form-group row">
//                           <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                             Booked On
//                           </label>
//                           <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                             <span className="label">{data?.booked_on}</span>
//                           </div>
//                         </div> */}
//                         <div className="form-group row">
//                           <label className="control-label col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
//                             Total Hours
//                           </label>
//                           <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12">
//                             <span className="label">{data?.total_hours}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <NavLink to="/my-slot-bookings"
//                     className='d-flex p-3 justify-content-center'>Back</NavLink>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ViewBookingSlot;
