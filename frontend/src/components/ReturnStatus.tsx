import React from "react";
import { useNavigate } from "react-router-dom";

import Tick from "../../src/assets/images/tick.png";
import Cancel from "../../src/assets/images/cancel.png";

type Props = {
  status: boolean;
};

const ReturnStatus: React.FC<Props> = ({ status }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="row">
      <div className="col-lg-12 mx-auto">
        <div className="card mb-4">
          {status ? (
            <div className="thankYouDetails text-center">
              <img src={Tick} className="img-fluid mb-3" alt="Success" />
              <h5>Your parking is confirmed.</h5>
            </div>
          ) : (
            <div className="thankYouDetails text-center">
              <img
                src={Cancel}
                className="img-fluid mb-3"
                alt="Cancelled"
                style={{ width: "100px" }}
              />
              <h5>Booking Cancelled</h5>
              <button
                className="btn btn-primary"
                style={{ cursor: "pointer" }}
                onClick={handleClick}
              >
                Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnStatus;










// import React from "react";

// import Tick from "../../src/assets/images/tick.png";
// import Cancel from "../../src/assets/images/cancel.png";
// import { useNavigate } from "react-router-dom";
// const ReturnStatus = ({ status }) => {
//   console.log("return status", status);
//   const navigate = useNavigate();
//   const handleClick = () => {
//     navigate("/");
//   };
//   return (
//     <div className="row">
//       <div className="col-lg-12 mx-auto">
//         <div className="card mb-4">
//           {status ? (
//             <div className="thankYouDetails text-center">
//               <img src={Tick} className="img-fluid mb-3" alt="" />

//               <h5> Your parking is confirmed. </h5>
//             </div>
//           ) : (
//             <div className="thankYouDetails text-center">
//               <img
//                 src={Cancel}
//                 className="img-fluid mb-3"
//                 alt=""
//                 style={{ width: "100px" }}
//               />

//               <h5> Booking Cancelled </h5>
//               <button
//                 className="btn btn-primary "
//                 style={{ cursor: "pointer" }}
//                 onClick={handleClick}
//               >
//                 Home
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReturnStatus;
