import {
  useState,
  useRef,
  useImperativeHandle,
  useEffect,
  forwardRef,
} from "react";
import type { RefObject } from "react";
import Logo from "../assets/images/logo.png";
import MobileLogo from "../assets/images/mobile-logo.png";
import ProfileLogo from "../assets/images/profile.png";
import { NavLink, useNavigate } from "react-router-dom";
import AxiosClient from "../axios/AxiosClient";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "../redux/userSlice";
import { toast } from "react-toastify";
import { searchSubmit } from "../redux/searchSlice";
import { Collapse } from "bootstrap";
import { useAuthContext } from "../context/AppContext";

interface HeaderRef {
  handleActiveClick: () => void;
  handleCloseClick: () => void;
}

const Header = forwardRef<HeaderRef>((props, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const navbarCollapseRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const navbarToggleRef = useRef<HTMLButtonElement>(null);
  const { isAuthenticated, logout } = useAuthContext();
  const userRedux = useSelector((state: any) => state.user.value);

  const handleNavItemClick = (path: string) => {
    const collapseInstance = Collapse.getInstance(navbarCollapseRef.current!);
    if (collapseInstance) {
      collapseInstance.hide();
      setIsNavbarOpen(false);
    }
    navigate(path);
  };

  const handleNavbarToggle = () => {
    const collapseInstance = Collapse.getOrCreateInstance(navbarCollapseRef.current!);
    collapseInstance?.toggle();
    setIsNavbarOpen((prev) => !prev);
  };

  const resetDispatch = () => {
    dispatch(
      searchSubmit({
        data: {
          from: "",
          to: "",
          selectedFromTime: "",
          selectedToTime: "",
          lat: "",
          lng: "",
        },
      })
    );
  };

  const clearCookies = () => {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  };

  const handleLogout = async () => {
    try {
      await AxiosClient.post("/api/auth/logout");
      toast.success("Logged out successfully!");
      dispatch(
        saveUser({
          data: {
            isLoggedIn: false,
            username: "",
            email: "",
            token: "",
            spotLength: 0,
            mobile: "",
            auth_owner_id: 0,
          },
        })
      );
      localStorage.clear();
      logout();
      clearCookies();
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutsideNavbar = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isNavbarOpen &&
        navbarCollapseRef.current &&
        !navbarCollapseRef.current.contains(target) &&
        navbarToggleRef.current &&
        !navbarToggleRef.current.contains(target)
      ) {
        const collapseInstance = Collapse.getInstance(navbarCollapseRef.current!);
        collapseInstance?.hide();
        setIsNavbarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideNavbar);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNavbar);
    };
  }, [isNavbarOpen]);

  useEffect(() => {
    const handleClickOutsidePopover = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutsidePopover);
    } else {
      document.removeEventListener("mousedown", handleClickOutsidePopover);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePopover);
    };
  }, [isPopoverOpen]);

  return (
    <section className="main-header">
      <div className="container">
        <nav className="navbar navbar-default navbar-expand-lg">
          <div className="navbar-header">
            <a className="navbar-brand">
              <NavLink to="/">
                <img src={Logo} className="logo" alt="Logo" />
              </NavLink>
              <NavLink to="/">
                <img src={MobileLogo} className="mobile-logo" alt="Mobile Logo" />
              </NavLink>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              onClick={handleNavbarToggle}
              aria-controls="navbarSupportedContent"
              aria-expanded={isNavbarOpen}
              aria-label="Toggle navigation"
              ref={navbarToggleRef}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div
            className={`collapse navbar-collapse horizontal-collapse ${isNavbarOpen ? "show" : ""}`}
            id="navbarSupportedContent"
            ref={navbarCollapseRef}
          >
            <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className="nav-link anchor-link"
                  onClick={() => {
                    resetDispatch();
                    handleNavItemClick("/");
                  }}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about" className="nav-link anchor-link">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/find-economy-parking"
                  className="nav-link anchor-link"
                  onClick={() => handleNavItemClick("/find-economy-parking")}
                >
                  Find a Spot to Park
                </NavLink>
              </li>
              {userRedux.spotLength === 0 && (
                <li className="nav-item">
                  <NavLink to="/rent-out-your-driveway" className="nav-link anchor-link">
                    List Your Driveway
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <a className="nav-link anchor-link" href="/blog/">
                  Blog
                </a>
              </li>
              <li
                className="nav-item"
                onMouseEnter={() => setIsAreaDropdownOpen(true)}
                onMouseLeave={() => setIsAreaDropdownOpen(false)}
                style={{ position: "relative" }}
              >
                <span className="nav-link dropdown-toggle anchor-link" role="button">
                  Areas We Serve
                </span>
                {isAreaDropdownOpen && (
                  <ul
                    className="dropdown-menu show"
                    style={{
                      display: "block",
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      zIndex: 1000,
                    }}
                  >
                    <li>
                      <NavLink to="/city/austin-parking" className="dropdown-item">
                        Austin Parking
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/city/dallas-parking" className="dropdown-item">
                        Dallas Parking
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav-item">
                <NavLink to="/contact-us" className="nav-link anchor-link">
                  Contact Us
                </NavLink>
              </li>
            </ul>

            <div className="menu-btn-group-new">
              <button
                className="profile-icon-btn"
                onClick={() => setIsPopoverOpen((prev) => !prev)}
              >
                <img id="profileImg" src={ProfileLogo} alt="Profile" />
              </button>

              {isPopoverOpen && (
                <div className="common-menu-item" id="popoverMenu" ref={popoverRef}>
                  {!isAuthenticated ? (
                    <NavLink
                      to="/userlogin"
                      className="nav-item"
                      onClick={() => handleNavItemClick("/userlogin")}
                    >
                      <i className="fa fa-caret-up" aria-hidden="true"></i>
                      <div className="login_btn">Login / Register</div>
                    </NavLink>
                  ) : (
                    <>
                      <NavLink
                        to="/dashboard"
                        className="nav-item"
                        onClick={() => handleNavItemClick("/dashboard")}
                      >
                        <i className="fa fa-caret-up" aria-hidden="true"></i>
                        <div className="login_btn">Dashboard</div>
                      </NavLink>
                      <NavLink
                        to="/booking-history"
                        className="nav-item"
                        onClick={() => handleNavItemClick("/booking-history")}
                      >
                        <div className="login_btn">My Bookings</div>
                      </NavLink>
                      <NavLink
                        to="/my-slot-bookings"
                        className="nav-item"
                        onClick={() => handleNavItemClick("/my-slot-bookings")}
                      >
                        <div className="login_btn">Driveway Bookings</div>
                      </NavLink>
                      <NavLink
                        to="/change-password"
                        className="nav-item"
                        onClick={() => handleNavItemClick("/change-password")}
                      >
                        <div className="login_btn">Change Password</div>
                      </NavLink>
                      <div className="nav-item" onClick={handleLogout}>
                        <div className="login_btn">Logout</div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {userRedux.spotLength > 0 && (
        <section>
          <div className="parking-slot-header">
            <NavLink className="parking-slots non-active" to="/my-parking-spot">
              My Driveways
              <div className="sub-head-arrow">
                <div className="sub-label-arrow"></div>
              </div>
            </NavLink>
            <NavLink className="parking-slots non-active" to="/my-slot-bookings">
              Driveway Bookings
              <div className="sub-head-arrow">
                <div className="sub-label-arrow"></div>
              </div>
            </NavLink>
            <NavLink className="parking-slots non-active" to="/earnings">
              My Earnings
              <div className="sub-head-arrow">
                <div className="sub-label-arrow"></div>
              </div>
            </NavLink>
          </div>
        </section>
      )}
    </section>
  );
});

export default Header;




// import { useState, useRef, useImperativeHandle, useEffect, forwardRef } from "react";
// import Logo from "../assets/images/logo.png";
// import MobileLogo from "../assets/images/mobile-logo.png";
// import ProfileLogo from "../assets/images/profile.png";
// import { NavLink, useNavigate } from "react-router-dom";
// import AxiosClient from "../axios/AxiosClient";
// import { useDispatch, useSelector } from "react-redux";
// import { saveUser } from "../redux/userSlice";
// import { toast } from "react-toastify";
// import { searchSubmit } from "../redux/searchSlice";
// import { Collapse } from "bootstrap";
// import { useAuthContext } from "../context/AppContext";

// const Header = forwardRef((props, ref) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isPopoverOpen, setIsPopoverOpen] = useState(false);
//   const [isNavbarOpen, setIsNavbarOpen] = useState(false);
//   const userRedux = useSelector((state) => state.user.value);
//   const navbarCollapseRef = useRef(null);
//   const popoverRef = useRef(null);
//   const navbarToggleRef = useRef(null);
//   const { isAuthenticated, logout } = useAuthContext();
//   const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);

//   const handleNavItemClick = (path) => {
//     const collapseInstance = Collapse.getInstance(navbarCollapseRef.current);
//     if (collapseInstance) {
//       collapseInstance.hide();
//       setIsNavbarOpen(false);
//     }
//     navigate(path);
//   };

//   const handleNavbarToggle = () => {
//     const collapseInstance = Collapse.getOrCreateInstance(navbarCollapseRef.current);
//     collapseInstance && collapseInstance.toggle();
//     setIsNavbarOpen((prev) => !prev);
//   };

//   const resetDispatch = async () => {
//     dispatch(
//       searchSubmit({
//         data: {
//           from: '',
//           to: '',
//           selectedFromTime: '',
//           selectedToTime: '',
//           lat: '',
//           lng: '',
//         },
//       })
//     );
//   };

//   const clearCookies = () => {
//     // Get all cookies
//     const cookies = document.cookie.split(";");

//     // Loop through each cookie and set the expiry date to a past time
//     cookies.forEach((cookie) => {
//       const eqPos = cookie.indexOf("=");
//       const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//     });
//   };

//   const handleLogout = async () => {
//     try {
//       await AxiosClient.post("/api/auth/logout");
//       toast.success("Logged out successfully!");

//       dispatch(
//         saveUser({
//           data: {
//             isLoggedIn: false,
//             username: "",
//             email: "",
//             token: "",
//             spotLength: 0,
//             mobile: '',
//             auth_owner_id: 0
//           },
//         })
//       );

//       localStorage.clear();
//       logout(false);

//       clearCookies();

//     } catch (error) {
//       console.error("Logout failed", error);
//       toast.error("Logout failed. Please try again.");
//     }
//   };


//   // Close navbar if clicked outside
//   useEffect(() => {
//     const handleClickOutsideNavbar = (event) => {
//       if (
//         isNavbarOpen &&
//         navbarCollapseRef.current &&
//         !navbarCollapseRef.current.contains(event.target) &&
//         !navbarToggleRef.current.contains(event.target)
//       ) {
//         const collapseInstance = Collapse.getInstance(navbarCollapseRef.current);
//         collapseInstance && collapseInstance.hide();
//         setIsNavbarOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutsideNavbar);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutsideNavbar);
//     };
//   }, [isNavbarOpen]);

//   // Close popover if clicked outside
//   useEffect(() => {
//     const handleClickOutsidePopover = (event) => {
//       if (popoverRef.current && !popoverRef.current.contains(event.target)) {
//         setIsPopoverOpen(false);
//       }
//     };

//     if (isPopoverOpen) {
//       document.addEventListener("mousedown", handleClickOutsidePopover);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutsidePopover);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutsidePopover);
//     };
//   }, [isPopoverOpen]);

//   return (
//     <>
//       <section className="main-header">
//         <div className="container">
//           <nav className="navbar navbar-default navbar-expand-lg">
//             <div className="navbar-header">
//               <a className="navbar-brand">
//                 <NavLink to="/">
//                   <img src={Logo} className="logo" alt="Logo" />
//                 </NavLink>
//                 <NavLink to="/">
//                   <img src={MobileLogo} className="mobile-logo" alt="Mobile Logo" />
//                 </NavLink>
//               </a>
//               <button
//                 className="navbar-toggler"
//                 type="button"
//                 onClick={handleNavbarToggle}
//                 aria-controls="navbarSupportedContent"
//                 aria-expanded={isNavbarOpen}
//                 aria-label="Toggle navigation"
//                 ref={navbarToggleRef}
//               >
//                 <span className="navbar-toggler-icon"></span>
//               </button>
//             </div>

//             <div className={`collapse navbar-collapse horizontal-collapse ${isNavbarOpen ? 'show' : ''}`} id="navbarSupportedContent" ref={navbarCollapseRef}>
//               <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
//                 <li className="nav-item">
//                   <NavLink to="/" className="nav-link anchor-link" onClick={() => { resetDispatch(); handleNavItemClick('/') }}>
//                     Home
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/about" className="nav-item">
//                     <a className="nav-link anchor-link">About</a>
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/find-economy-parking" className="nav-link anchor-link" onClick={() => handleNavItemClick('/find-economy-parking')}>
//                     Find a Spot to Park
//                   </NavLink>
//                 </li>
//                 {userRedux.spotLength === 0 && (
//                   <li className="nav-item">
//                     <NavLink to='/rent-out-your-driveway' className="nav-link anchor-link">
//                       List Your Driveway
//                     </NavLink>
//                   </li>
//                 )}
//                 <li className="nav-item">
//                   {/* <NavLink to="/blog/" className="nav-item"> */}
//                   <a className="nav-link anchor-link" href="/blog/">Blog</a>
//                   {/* </NavLink> */}
//                 </li>
//                 <li
//                   className="nav-item"
//                   onMouseEnter={() => setIsAreaDropdownOpen(true)}
//                   onMouseLeave={() => setIsAreaDropdownOpen(false)}
//                   style={{ position: 'relative' }}
//                 >
//                   <span className="nav-link dropdown-toggle anchor-link" role="button">
//                     Areas We Serve
//                   </span>
//                   {isAreaDropdownOpen && (
//                     <ul
//                       className="dropdown-menu show"
//                       style={{
//                         display: 'block',
//                         position: 'absolute',
//                         top: '100%',
//                         left: 0,
//                         backgroundColor: '#fff',
//                         border: '1px solid #ccc',
//                         zIndex: 1000,
//                       }}
//                     >
//                       <li>
//                         <NavLink to="/city/austin-parking" className="dropdown-item">
//                           Austin Parking
//                         </NavLink>
//                       </li>
//                       <li>
//                         <NavLink to="/city/dallas-parking" className="dropdown-item">
//                           Dallas Parking
//                         </NavLink>
//                       </li>
//                     </ul>
//                   )}
//                 </li>
//                 <li className="nav-item">
//                   <NavLink to="/contact-us" className="nav-item">
//                     <a className="nav-link anchor-link">Contact Us</a>
//                   </NavLink>
//                 </li>

//               </ul>
//               <div className="menu-btn-group-new">
//                 <button className="profile-icon-btn" onClick={() => setIsPopoverOpen((prev) => !prev)}>
//                   <img id="profileImg" src={ProfileLogo} alt="Profile" />
//                 </button>

//                 {isPopoverOpen && (
//                   <div className="common-menu-item" id="popoverMenu" ref={popoverRef}>
//                     {!isAuthenticated ? (
//                       <>
//                         {/* <NavLink to="/city/austin-parking" className="nav-item">
//                           <i className="fa fa-caret-up" aria-hidden="true"></i>
//                           <div className="login_btn">Austin Parking</div>
//                         </NavLink>
//                         <NavLink to="/city/dallas-parking" className="nav-item">
//                           <i className="fa fa-caret-up" aria-hidden="true"></i>
//                           <div className="login_btn">Dallas Parking</div>
//                         </NavLink> */}
//                         <NavLink
//                           to="/userlogin"
//                           className="nav-item"
//                           onClick={() => handleNavItemClick('/userlogin')}
//                         >
//                           <i className="fa fa-caret-up" aria-hidden="true"></i>
//                           <div className="login_btn">Login / Register</div>
//                         </NavLink>
//                       </>
//                     ) : (
//                       <>
//                         <NavLink
//                           to="/dashboard"
//                           className="nav-item"
//                           onClick={() => handleNavItemClick('/dashboard')}
//                         >
//                           <i className="fa fa-caret-up" aria-hidden="true"></i>
//                           <div className="login_btn">Dashboard</div>
//                         </NavLink>
//                         <NavLink
//                           to="/booking-history"
//                           className="nav-item"
//                           onClick={() => handleNavItemClick('/booking-history')}
//                         >
//                           <div className="login_btn">My Bookings</div>
//                         </NavLink>
//                         <NavLink
//                           to="/my-slot-bookings"
//                           className="nav-item"
//                           onClick={() => handleNavItemClick('/my-slot-bookings')}
//                         >
//                           <div className="login_btn">Driveway Bookings</div>
//                         </NavLink>
//                         <NavLink
//                           to="/change-password"
//                           className="nav-item"
//                           onClick={() => handleNavItemClick('/change-password')}
//                         >
//                           {/* <NavLink to="/city/austin-parking" className="nav-item">
//                           <i className="fa fa-caret-up" aria-hidden="true"></i>
//                           <div className="login_btn">Austin Parking</div>
//                         </NavLink>
//                         <NavLink to="/city/dallas-parking" className="nav-item">
//                           <i className="fa fa-caret-up" aria-hidden="true"></i>
//                           <div className="login_btn">Dallas Parking</div>
//                         </NavLink> */}
//                           <div className="login_btn">Change Password</div>
//                         </NavLink>
//                         <div className="nav-item" onClick={handleLogout}>
//                           <div className="login_btn">Logout</div>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </nav>
//         </div>
//       </section>
//       {userRedux.spotLength > 0 && (
//         <section>
//           <div className="parking-slot-header">
//             <NavLink className="parking-slots non-active" to="/my-parking-spot">
//               My Driveways
//               <div className="sub-head-arrow"><div className="sub-label-arrow"></div></div>
//             </NavLink>
//             <NavLink className="parking-slots non-active" to="/my-slot-bookings">
//               Driveway Bookings
//               <div className="sub-head-arrow"><div className="sub-label-arrow"></div></div>
//             </NavLink>
//             <NavLink className="parking-slots non-active" to="/earnings">
//               My Earnings
//               <div className="sub-head-arrow"><div className="sub-label-arrow"></div></div>
//             </NavLink>
//           </div>
//         </section>
//       )}
//     </>
//   );
// });

// export default Header;
