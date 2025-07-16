import { useNavigate } from "react-router-dom";
import ListImg from "../assets/images/listimage.jpg";

const ParkingListOld = ({ data }: { data: any[] }) => {
  const navigate = useNavigate();

  const handleClick = (id: number | string) => {
    navigate(`/booking-detail/${id}`);
  };

  const latestItems = Array.isArray(data) ? data.slice(0, 9) : [];

  return (
    <div className="parkListing">
      <div className="container">
        <div className="row">
          {latestItems.map((item) => (
            <div className="col-lg-4" key={item.id}>
              <div className="newsItemBlock card homecard">
                <div className="listImage">
                  <span>{item.available_slots} Available</span>
                  <a>
                    <img
                      src={ListImg}
                      className="img-fluid"
                      alt={item.slot_name || "Parking slot"}
                    />
                  </a>
                </div>
                <div className="listingContent">
                  <h3>
                    <a>{item.slot_name}</a>
                  </h3>
                  <div className="location">
                    1.5 km away, {item.nearby_places}
                  </div>
                  <div className="time">
                    Available Time Slot: {item.available_time} Hours
                  </div>
                  <div className="listingBottom">
                    <strong>
                      $
                      {item.vehicle_fees === "undefined" ||
                      item.vehicle_fees === undefined
                        ? "10"
                        : item.vehicle_fees}
                      /hr
                    </strong>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleClick(item.id)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParkingListOld;









// import { useNavigate } from "react-router-dom";
// import ListImg from "../assets/images/listimage.jpg";

// const ParkingListOld = ({ data }) => {
//   const navigate = useNavigate();

//   const handleClick = (id) => {
//     navigate(`/booking-detail/${id}`);
//   };
//   const latestItems = data.slice(0, 9);
//   return (
//     <div className="parkListing">
//       <div className="container">
//         <div className="row">
//           {latestItems?.map((item) => {
//             console.log("item value", item);
//             return (
//               <div className="col-lg-4" key={item.id}>
//                 <div className="newsItemBlock card homecard">
//                   <div className="listImage">
//                     <span>{item.available_slots} Available</span>
//                     <a>
//                       <img src={ListImg} className="img-fluid" alt={item.slot_name}/>
//                     </a>
//                   </div>
//                   <div className="listingContent">
//                     <h3>
//                       <a>{item.slot_name}</a>
//                     </h3>
//                     <div className="location">
//                       1.5 km away, {item.nearby_places}
//                     </div>
//                     <div className="time">
//                       Available Time Slot : {item.available_time} Hours
//                     </div>

//                     <div className="listingBottom">
//                       <strong>
//                         $
//                         {item.vehicle_fees === "undefined"
//                           ? "10"
//                           : item.vehicle_fees}
//                         /hr
//                       </strong>

//                       <button
//                         className="btn btn-outline-primary"
//                         onClick={() => handleClick(item.id)}
//                       >
//                         Book Now
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ParkingListOld;
