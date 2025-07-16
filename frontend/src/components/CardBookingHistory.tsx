import React from 'react';

interface CancelledBooking {
  cancelled_by: string;
  cancelled_date: string;
  refund_status: string;
  reason_for_cancellation: string;
  refund_amount: number;
}

interface BookingData {
  title: string;
  location: string;
  vehicle_number: string;
  amount: number;
  booked_on: string;
  fromTime: string;
  toTime: string;
  date: string;
  status: 'Booked' | 'Cancelled' | 'Confirmed';
  img?: { photo_path: string }[];
  cancelled_booking?: CancelledBooking;
  onClick?: (data: BookingData) => void;
}

const CardBookingHistory: React.FC<BookingData> = (data) => {
  let status = '';
  const expirationDate = new Date(data.date);
  const now = new Date();

  if (data.status === 'Booked' && expirationDate > now) {
    status = 'Recent';
  } else if (data.status === 'Cancelled') {
    status = 'Cancelled';
  } else if (data.status === 'Confirmed' || expirationDate <= now) {
    status = 'Completed';
  }

  return (
    <div className="card mb-3">
      <div className="booklistingContent">
        <div className="row g-0 d-flex align-items-center">
          <div className="col-lg-4 col-md-12">
            {data.img?.[0]?.photo_path && (
              <img
                src={`${
                  import.meta.env.VITE_APP_BASE_URL
                }/storage/${data.img[0].photo_path.slice(6)}`}
                className="img-fluid"
              />
            )}
          </div>

          <div className="col-lg-5 col-md-12">
            <div className="card-body">
              <h3>
                <a>{data.title}</a>
                <span
                  className={`bookinglabel ${
                    status === 'Recent' ? 'confirm' : 'cancel'
                  }`}
                >
                  {status === 'Recent' ? 'Booked' : status}
                </span>
              </h3>
              <div className="location">{data.location}</div>
              <div className="car">Vehicle No. :{data.vehicle_number}</div>
              <div className="dollar">
                <span>Total Cost:</span> ${data.amount}
              </div>
              <div className="time">
                <span>Booked on:</span> {data.booked_on}
              </div>

              <div className="time" style={{ display: 'flex' }}>
                <span>Booked for:&nbsp;</span>
                <div>
                  <div>From: {data.fromTime}</div>
                  <div>To: {data.toTime}</div>
                </div>
              </div>

              {status === 'Cancelled' && data.cancelled_booking && (
                <>
                  <div className="refund">
                    <span>
                      Cancelled By: {data.cancelled_booking.cancelled_by}
                    </span>
                  </div>
                  <div className="refund">
                    <span>
                      Cancelled Date: {data.cancelled_booking.cancelled_date}
                    </span>
                  </div>
                  <div className="refund">
                    <span>
                      Refund Status: {data.cancelled_booking.refund_status}
                    </span>
                  </div>
                  <div className="refund">
                    <span>
                      Reason for Cancellation:{' '}
                      {data.cancelled_booking.reason_for_cancellation}
                    </span>
                  </div>
                  {data.cancelled_booking.refund_amount > 0 && (
                    <div className="refund">
                      <span>
                        Refund Amount: {data.cancelled_booking.refund_amount}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="col-lg-3 col-md-12">
            <div className="bookingInfo">
              {status === 'Recent' && data.onClick && (
                <a
                  className="btn btn-outline-gray"
                  onClick={() => data.onClick && data.onClick(data)}
                >
                  Cancel booking
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBookingHistory;




// const CardBookingHistory = (data) => {
//   let status = '';
//   const expirationDate = new Date(data.date);
//   const now = new Date();

//   if (data.status === "Booked" && expirationDate > now) {
//     status = "Recent";
//   } else if (data.status === "Cancelled") {
//     status = "Cancelled";
//   } else if (data.status === "Confirmed" || expirationDate <= now) {
//     status = "Completed";
//   }
//   return (
//     <div className="card mb-3">
//       <div className="booklistingContent">
//         <div className="row g-0 d-flex align-items-center">
//           <div className="col-lg-4 col-md-12">
//             {data.img && data.img.length > 0 && data.img[0].photo_path && (
//               <img
//                 src={`${
//                   import.meta.env.VITE_APP_BASE_URL
//                 }/storage/${data.img[0].photo_path.slice(6)}`}
//                 className="img-fluid"
//               />
//             )}
//             {/* <img src={data.img} className="img-fluid" alt="" /> */}
//           </div>
//           <div className="col-lg-5 col-md-12">
//             <div className="card-body">
//               <h3>
//                 <a>{data.title}</a>
//                 <span
//                   className={`bookinglabel ${
//                     status === "Recent" ? "confirm" : "cancel"
//                   }`}
//                 >
//                   {status === "Recent" ? "Booked" : status}
//                 </span>
//               </h3>
//               <div className="location">{data.location}</div>
//               <div className="car">Vehicle No. :{data.vehicle_number} </div>
//               {/* <div className="time">
//                 Selected date :{dateTime.date}

//               </div> */}
//               <div className="dollar">
//                 <span>Total Cost:</span> ${data.amount}
//               </div>
//               <div className="time">
//                 <span>Booked on:</span> {data.booked_on}
//               </div>

//               <div className="time" style={{ display: 'flex' }}>
//                 <span>Booked for:&nbsp;</span>
//                 <div>
//                   <div>From: {data.fromTime}</div>
//                   <div>To:    {data.toTime}</div>
//                 </div>


//               </div>

//               {status === "Cancelled" && data.cancelled_booking && (
//                 <>
//                   <div className="refund">
//                     <span>
//                       Cancelled By: {data.cancelled_booking.cancelled_by}
//                     </span>
//                   </div>
//                   <div className="refund">
//                     <span>
//                       Cancelled Date: {data.cancelled_booking.cancelled_date}
//                     </span>
//                   </div>
//                   <div className="refund">
//                     <span>
//                       Refund Status: {data.cancelled_booking.refund_status}
//                     </span>
//                   </div>
//                   <div className="refund">
//                     <span>
//                       Reason for Cancellation:{" "}
//                       {data.cancelled_booking.reason_for_cancellation}
//                     </span>
//                   </div>
//                   {data.cancelled_booking.refund_amount > 0 && (
//                     <div className="refund">
//                       <span>
//                         Refund Amount: {data.cancelled_booking.refund_amount}
//                       </span>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="col-lg-3 col-md-12">
//             <div className="bookingInfo">
//               {/* <a className="btn btn-outline-gray">View booking details</a>
//               <a className="btn btn-outline-gray">Book again</a> */}
//               {status === "Recent" && (
//                 <a
//                   className="btn btn-outline-gray"
//                   onClick={() => data.onClick(data)}
//                 >
//                   Cancel booking
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardBookingHistory;
