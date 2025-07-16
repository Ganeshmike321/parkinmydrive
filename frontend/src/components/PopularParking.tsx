import React from "react";

const PopularParking: React.FC = () => {
  return (
    <div className="popularParkingOuter">
      <div className="container">
        <h2>What Our Users Say</h2>
        <div className="row">
          <div className="col-lg-4" style={{ textAlign: "center" }}>
            <p className="text-muted">
              <i className="fa fa-quote-left pe-2"></i>
              "I've been using Park In My Driveway for a few months now, and it's been a great way to make some extra money."
            </p>
            <h5 className="mb-1">John Doe</h5>
            <p>Austin, TX</p>
          </div>
          <div className="col-lg-4" style={{ textAlign: "center" }}>
            <p className="text-muted">
              <i className="fa fa-quote-left pe-2"></i>
              "Park In My Driveway has been a lifesaver. I always struggle to find parking near my office, but now I can easily rent a spot from someone nearby."
            </p>
            <h5 className="mb-1">Jane Smith</h5>
            <p>Austin, TX</p>
          </div>
          <div className="col-lg-4" style={{ textAlign: "center" }}>
            <p className="text-muted">
              <i className="fa fa-quote-left pe-2"></i>
              "I love using Park In My Driveway to rent out my parking spot. It's so easy to use, and I'm making more money than I ever thought possible."
            </p>
            <h5 className="mb-1">Mike Johnson</h5>
            <p>Austin, TX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularParking;



// import React from "react";

// const PopularParking = () => {
//   return (
//     <div className="popularParkingOuter">
//       <div className="container">
//         <h2>What Our Users Say</h2>
//         <div className="row">
//           <div className="col-lg-4" style={{textAlign: "center"}}>
//             {/* <div className="popularParkingOuterList">
//               <ul>
//                 <li>Wembley parking</li>
//                 <li>Twickenham parking</li>
//                 <li>Arsenal, Emirates Parking</li>
//               </ul>
//             </div> */}
//             <p className="text-muted">
//               <i className="fa fa-quote-left pe-2"></i>
//               "I've been using Park In My Driveway for a few months now, and it's been a great way to make some extra money."
//             </p>
//             <h5 className="mb-1">John Doe</h5>
//             <p>Austin, TX</p>
//           </div>
//           <div className="col-lg-4" style={{textAlign: "center"}}>
//             {/* <div className="popularParkingOuterList">
//               <ul>
//                 <li>Wembley parking</li>
//                 <li>Twickenham parking</li>
//                 <li>Arsenal, Emirates Parking</li>
//               </ul>
//             </div> */}
//             <p className="text-muted">
//               <i className="fa fa-quote-left pe-2"></i>
//               "Park In My Driveway has been a lifesaver. I always struggle to find parking near my office, but now I can easily rent a spot from someone nearby."
//             </p>
//             <h5 className="mb-1">Jane Smith</h5>
//             <p>Austin, TX</p>
//           </div>
//           <div className="col-lg-4" style={{textAlign: "center"}}>
//             {/* <div className="popularParkingOuterList">
//               <ul>
//                 <li>Wembley parking</li>
//                 <li>Twickenham parking</li>
//                 <li>Arsenal, Emirates Parking</li>
//               </ul>
//             </div> */}
//             <p className="text-muted">
//               <i className="fa fa-quote-left pe-2"></i>
//               "I love using Park In My Driveway to rent out my parking spot. It's so easy to use, and I'm making more money than I ever thought possible."
//             </p>
//             <h5 className="mb-1">Mike Johnson</h5>
//             <p>Austin, TX</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PopularParking;
