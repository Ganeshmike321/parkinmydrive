import React, { useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import BreadCrumbs from "../../components/BreadCrumbs";
import Header from "../../components/Header";
import Loader from "../../components/Loader";

// Types
interface DashboardAction {
  to: string;
  label: string;
  className?: string;
}

// Constants
const DASHBOARD_ACTIONS: DashboardAction[] = [
  {
    to: '/rent-out-your-driveway',
    label: 'List your driveway',
    className: 'btn btn-primary btn-block'
  },
  {
    to: '/find-economy-parking',
    label: 'Find a spot to park',
    className: 'btn btn-primary btn-block'
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // Memoized navigation handler
  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Legacy click handler (currently unused but preserved for potential future use)
  const handleClick = useCallback(() => {
    handleNavigation("/rent-out-your-driveway");
  }, [handleNavigation]);

  // Action button component for reusability
  const ActionButton: React.FC<DashboardAction> = ({ to, label, className = 'btn btn-primary btn-block' }) => (
    <NavLink
      to={to}
      className={className}
      role="button"
      aria-label={label}
    >
      {label}
    </NavLink>
  );

  return (
    <>
      {/* Conditionally render header if needed */}
      {/* <Header /> */}
      
      <BreadCrumbs title="Welcome to Park In My Driveway" />
      
      <div className="loginOuter afterownerLogin">
        <div className="container">
          <div className="dashboardList">
            <div className="row">
              <div className="mb-5 col-xl-7 col-md-9 mx-auto">
                <div className="py-2 shadow card border-left-primary h-100">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="mr-2 col">
                        <div className="text-center text-xs font-weight-bold text-primary">
                          <h3>Start Your Driveway</h3>
                          
                          <div className="d-flex justify-content-center gap-3">
                            {DASHBOARD_ACTIONS.map((action, index) => (
                              <ActionButton
                                key={action.to}
                                to={action.to}
                                label={action.label}
                                className={action.className}
                              />
                            ))}
                          </div>
                          
                          {/* Preserved commented legacy code for reference */}
                          {/* 
                          You dont have slots, please{" "}
                          <button
                            onClick={handleClick}
                            type="button"
                            className="btn-link cursor text-underline"
                            aria-label="Add slots to get bookings"
                          >
                            add slots
                          </button>
                          to get bookings. 
                          */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Show loader when loading */}
      {loading && <Loader />}
      
      <Footer />
    </>
  );
};

export default Dashboard;





// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import Footer from "../../components/Footer";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import Header from "../../components/Header";
// import Loader from "../../components/Loader";
// import { useEffect, useState } from "react";
// const Dashboard = () => {
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);
//     const handleClick = () => {
//       navigate("/rent-out-your-driveway");
//     };

//     return (
//       <>
//         {/* <Header /> */}
//         <BreadCrumbs title="Welcome to Park In My Driveway" />
//         <div className="loginOuter afterownerLogin">
//           <div className="container">
//             <div className="dashboardList">
//               <div className="row">
//                 <div className="mb-5 col-xl-7 col-md-9 mx-auto">
//                   <div className="py-2 shadow card border-left-primary h-100">
//                     <div className="card-body">
//                       <div className="row no-gutters align-items-center">
//                         <div className="mr-2 col">
//                           <div className="text-center text-xs font-weight-bold text-primary">
//                             <h3>Start Your Driveway</h3>
//                             <div className="d-flex justify-content-center gap-8">
//                                 <NavLink
//                                     to='/rent-out-your-driveway'
//                               className="btn btn-primary btn-block"
//                                 >
//                                     List your driveway
//                                 </NavLink>
//                                 <NavLink
//                                     to='/find-economy-parking'
//                               className="btn btn-primary btn-block"
//                                 >
//                                     find a spot to park
//                                 </NavLink>
//                             </div>
//                             {/* You dont have slots, please{" "}
//                             <a
//                               onClick={handleClick}
//                               style={{ cursor: "pointer" }}
//                               className="cursor text-underline"
//                             >
//                               add slots
//                             </a>
//                             to get bookings. */}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   };

//   export default Dashboard;
