import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import BookingHistory from "./pages/BookingHistory";
import BookingDetail from "./pages/BookingDetail";
import Listing from "./pages/Listing";
import ReviewBooking from "./pages/ReviewBooking";
import FindParkingSpot from "./pages/FindParkingSpot";
import ListParkingSpot from "./components/ListParkingSpot";
import ForgetResetPage from "./pages/ForgetResetPage";
import PasswordReset from "./pages/PasswordReset";
import UserLogin from './pages/UserLogin';
import Dashboard from "./pages/dashboard";
import ParkingSpots from "./pages/parkingSpots";
import AddParkingSpots from "./components/AddParkingSpots";
import MyBookingSlots from "./pages/MyBookingSlots";
import ViewParkingSpots from "./components/ViewParkingSpots";
import EditParkingSpot from "./components/EditParkingSpot";
import Earnings from "./pages/Earnings";
import Profile from "./pages/profile";
import ViewBookingSlot from "./components/ViewBookingSlot";
import EditBookingSlot from "./components/EditBookingSlot";
import ChangePassword from "./pages/ChangePassword";
import ViewCancelledBooking from "./components/ViewCancelledBooking";
import ViewlotBookings from "./pages/view-slot-bookings";
import About from "./pages/about";
import ContactUs from "./pages/contactUs";
import { useAuthContext } from "./context/AppContext";
import AustinParking from './pages/city/austin-parking';
import DallasParking from "./pages/city/dallas-parking";

interface RouteProps {
  children: ReactNode;
}

const AuthenticatedRoute = ({ children }: RouteProps) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <>{children}</> : <Navigate to="/userlogin" replace />;
};

const UnAuthenticatedRoute = ({ children }: RouteProps) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/userlogin"
        element={
          <UnAuthenticatedRoute>
            <UserLogin />
          </UnAuthenticatedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AuthenticatedRoute>
            <Dashboard />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/listing"
        element={
          <AuthenticatedRoute>
            <Listing />
          </AuthenticatedRoute>
        }
      />
      <Route path="/review-booking/:id" element={<ReviewBooking />} />
      <Route path="/booking-detail/:id" element={<BookingDetail />} />
      <Route path="/city/austin-parking" element={<AustinParking />} />
      <Route path="/city/dallas-parking" element={<DallasParking />} />
      <Route
        path="/booking-history"
        element={
          <AuthenticatedRoute>
            <BookingHistory />
          </AuthenticatedRoute>
        }
      />
      <Route path="/find-economy-parking" element={<FindParkingSpot />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route
        path="/my-parking-spot"
        element={
          <AuthenticatedRoute>
            <ParkingSpots />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/earnings"
        element={
          <AuthenticatedRoute>
            <Earnings />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/view-cancelled-booking"
        element={
          <AuthenticatedRoute>
            <ViewCancelledBooking />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/rent-out-your-driveway"
        element={
          <AuthenticatedRoute>
            <AddParkingSpots />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/my-slot-bookings"
        element={
          <AuthenticatedRoute>
            <MyBookingSlots />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/view-slot-bookings"
        element={
          <AuthenticatedRoute>
            <ViewlotBookings />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthenticatedRoute>
            <Profile />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <AuthenticatedRoute>
            <ChangePassword />
          </AuthenticatedRoute>
        }
      />
      <Route path="/view-parking-spot" element={<ViewParkingSpots />} />
      <Route
        path="/edit-parking-spot"
        element={
          <AuthenticatedRoute>
            <EditParkingSpot />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/view-booking-slot"
        element={
          <AuthenticatedRoute>
            <ViewBookingSlot />
          </AuthenticatedRoute>
        }
      />
      <Route path="/list-parking-spot" element={<ListParkingSpot />} />
      <Route
        path="/edit-booking-slot"
        element={
          <AuthenticatedRoute>
            <EditBookingSlot />
          </AuthenticatedRoute>
        }
      />
      <Route path="/forgetPassword" element={<ForgetResetPage />} />
      <Route path="/password-reset/:token" element={<PasswordReset />} />
    </Routes>
  );
};

export default AppRoutes;







// import { useEffect } from "react";
// import type { ReactNode } from "react";
// import {Navigate, Route, Routes, useLocation} from "react-router-dom";
// import HomePage from "./pages/Home/index.js";
// import BookingHistory from "./pages/BookingHistory/index.js";
// import BookingDetail from "./pages/BookingDetail/index.js";
// import Listing from "./pages/Listing/index.js";
// import ReviewBooking from "./pages/ReviewBooking/index.js";
// import FindParkingSpot from "./pages/FindParkingSpot/index.js";
// import ListParkingSpot from "./components/ListParkingSpot.js";
// import ForgetResetPage from "./pages/ForgetResetPage/index.js";
// import PasswordReset from "./pages/PasswordReset/index.js";
// import UserLogin from './pages/UserLogin/index.js'
// import Dashboard from "./pages/dashboard/index.js";
// import ParkingSpots from "./pages/parkingSpots/index.js";
// import AddParkingSpots from "./components/AddParkingSpots.js";
// import MyBookingSlots from "./pages/MyBookingSlots/index.js";
// import ViewParkingSpots from "./components/ViewParkingSpots.js";
// import EditParkingSpot from "./components/EditParkingSpot.js";
// import Earnings from "./pages/Earnings/index.js";
// import Profile from "./pages/profile/index.js";
// import ViewBookingSlot from "./components/ViewBookingSlot.js";
// import EditBookingSlot from "./components/EditBookingSlot.js";
// import ChangePassword from "./pages/ChangePassword/index.js";
// import ViewCancelledBooking from "./components/ViewCancelledBooking.js";
// import ViewlotBookings from "./pages/view-slot-bookings/index.js";
// import About from "./pages/about/index.js";
// import ContactUs from "./pages/contactUs/index.js";
// import {useAuthContext} from "./context/AppContext.js";
// import AustinParking from './pages/city/austin-parking/index.js'
// import ReactGA from 'react-ga4';
// import DallasParking from "./pages/city/dallas-parking/index.js";

// const AuthenticatedRoute = ({ children }) => {
//    const {isAuthenticated} = useAuthContext();
//    return isAuthenticated ? (
//      <>{children}</>
//    ) : (
//        <Navigate to="/userlogin" replace="true" />
//    );
// };

// const UnAuthenticatedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuthContext();
//   return isAuthenticated ? (
//     <Navigate to="/dashboard" />
//   ) : (
//     <>{children}</>
//   );
// };

// const AppRoutes = () => {

//     return (
//         <>
//         <Routes>
//             <Route
//                 path="/"
//                 element={
//                     <HomePage />
//                 }
//             />
//             <Route
//                 path="/userlogin"
//                 element={
//                     <UnAuthenticatedRoute>
//                         <UserLogin />
//                     </UnAuthenticatedRoute>
//                 }
//             />
//             <Route
//                 path="/dashboard"
//                 element={
//                     <AuthenticatedRoute>
//                         <Dashboard />
//                     </AuthenticatedRoute>
//                 }
//             />
//             <Route
//                 path="/listing"
//                 element={
//                     <AuthenticatedRoute>
//                         <Listing />
//                     </AuthenticatedRoute>
//                 }
//             />
//             <Route
//                 path="/review-booking/:id"
//                 element={
//                         <ReviewBooking />
//                 }
//             ></Route>
//             <Route
//                 path="/booking-detail/:id"
//                 element={
//                         <BookingDetail />
//                 }
//             />
//              <Route
//                 path="/city/austin-parking"
//                 element={
//                         <AustinParking />
//                 }
//             />
//               <Route
//                 path="/city/dallas-parking"
//                 element={
//                         <DallasParking />
//                 }
//             />
//             <Route
//                 path="/booking-history"
//                 element={
//                     <AuthenticatedRoute>
//                         <BookingHistory />
//                     </AuthenticatedRoute>
//                 }
//             />
//             <Route
//                 path="/find-economy-parking"
//                 element={<FindParkingSpot />}
//       />
//       <Route
//         path="/about"
//         element={<About />}
//       />

//       <Route
//         path="/contact-us"
//         element={<ContactUs />}
//       />

//       <Route
//         path="/my-parking-spot"
//         element={
//           <AuthenticatedRoute>
//             <ParkingSpots />
//           </AuthenticatedRoute>
//         }
//       />
//       <Route
//         path="/earnings"
//         element={
//           <AuthenticatedRoute>
//             <Earnings />
//           </AuthenticatedRoute>
//         }
//       />
//       <Route
//         path="/view-cancelled-booking"
//         element={
//           <AuthenticatedRoute>
//             <ViewCancelledBooking />
//           </AuthenticatedRoute>
//         }
//       />
//       <Route
//         path="/rent-out-your-driveway"
//         element={
//           <AuthenticatedRoute>
//             <AddParkingSpots />
//           </AuthenticatedRoute>
//         }
//       />
//       <Route
//         path="/my-slot-bookings"
//         element={
//           <AuthenticatedRoute>
//             <MyBookingSlots />
//           </AuthenticatedRoute>
//         }
//       />
//             <Route
//         path="/view-slot-bookings"
//         element={
//           <AuthenticatedRoute>
//             <ViewlotBookings />
//           </AuthenticatedRoute>
//         }
//       />
//       <Route
//         path="/profile"
//         element={
//           <AuthenticatedRoute>
//             <Profile />
//           </AuthenticatedRoute>
//         }
//       />
//       <Route
//         path="/change-password"
//         element={
//           <AuthenticatedRoute>
//             <ChangePassword />
//           </AuthenticatedRoute>
//         }
//       />
//       <Route
//         path="/view-parking-spot"
//         element={
//             <ViewParkingSpots />
//         }
//       />
//       <Route
//         path="/edit-parking-spot"
//         element={
//           <AuthenticatedRoute>
//             <EditParkingSpot />
//           </AuthenticatedRoute>
//         }
//       />
//       <Route
//         path="/view-booking-slot"
//         element={
//           <AuthenticatedRoute>
//             <ViewBookingSlot />
//           </AuthenticatedRoute>
//         }
//       />
//       <Route
//         path="/list-parking-spot"
//         element={
//             <ListParkingSpot />
//         }
//       />
//       <Route
//         path="/edit-booking-slot"
//         element={
//           <AuthenticatedRoute>
//             <EditBookingSlot />
//           </AuthenticatedRoute>
//         }
//       />

//       <Route path="/forgetPassword" element={<ForgetResetPage />} />
//       <Route path="/password-reset/:token" element={<PasswordReset />} />
//     </Routes>
//         </>);
// };
// export default AppRoutes;
